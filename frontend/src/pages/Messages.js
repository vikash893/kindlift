import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { socket } from '../lib/socket';
import {
  MessageCircle, Send, ArrowLeft, Users, Shield, ChevronRight
} from 'lucide-react';

/**
 * Safe ID comparison — handles MongoDB ObjectId objects, strings, and undefined.
 * Always converts both sides to string before comparing.
 */
const idMatch = (a, b) => {
  if (!a || !b) return false;
  return String(a) === String(b);
};

// ─── Conversation List ────────────────────────────────
const ConversationList = ({ onSelect, selectedId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get('/dm/conversations');
      setConversations(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // Refresh on new DM
  useEffect(() => {
    const handler = () => fetchConversations();
    socket.on('dm_message', handler);
    return () => socket.off('dm_message', handler);
  }, [fetchConversations]);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="loader-spinner" />
    </div>
  );

  if (conversations.length === 0) return (
    <div className="p-8 text-center">
      <MessageCircle className="h-10 w-10 mx-auto text-brand-muted/30 mb-4" />
      <p className="text-brand-muted text-sm mb-2">No conversations yet</p>
      <p className="text-xs text-brand-muted/60">Add friends to start messaging</p>
    </div>
  );

  return (
    <div className="divide-y divide-brand-gray-light">
      {conversations.map(c => {
        if (!c.friend) return null;
        const isSelected = selectedId === c.friend._id;
        return (
          <button key={c.friend._id}
            onClick={() => onSelect(c.friend)}
            className={`w-full flex items-center gap-3 p-4 text-left transition-all hover:bg-brand-dark/[0.03] ${isSelected ? 'bg-brand-accent/5 border-l-2 border-brand-accent' : ''}`}>
            <div className="h-11 w-11 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold overflow-hidden flex-shrink-0">
              {c.friend.profilePhoto ? <img src={c.friend.profilePhoto} alt="" className="h-full w-full object-cover" /> : c.friend.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <p className="font-display font-semibold text-brand-dark text-sm truncate">{c.friend.name}</p>
                  {c.friend.isDriverVerified && (
                    <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
                {c.unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] bg-brand-accent text-brand-dark rounded-full font-bold">{c.unreadCount}</span>
                )}
              </div>
              {c.latestMessage && (
                <p className="text-xs text-brand-muted truncate mt-0.5">{c.latestMessage.text}</p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-brand-muted/30 flex-shrink-0" />
          </button>
        );
      })}
    </div>
  );
};

// ─── Chat View ────────────────────────────────────────
const ChatView = ({ friendId, friend, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Resolve the current user's ID — check both .id and ._id to handle
  // all possible shapes the AuthContext user object might have.
  const myId = user?.id || user?._id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = useCallback(async () => {
    if (!friendId) return;
    setLoading(true);
    try {
      const res = await api.get(`/dm/${friendId}/messages`);
      setMessages(res.data);
      // Mark as read
      await api.put(`/dm/${friendId}/read`);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [friendId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Real-time incoming messages
  useEffect(() => {
    const handler = (msg) => {
      // Accept messages that belong to this conversation (either direction)
      const isForThisChat =
        (idMatch(msg.senderId, friendId) && idMatch(msg.receiverId, myId)) ||
        (idMatch(msg.senderId, myId) && idMatch(msg.receiverId, friendId));

      if (!isForThisChat) return;

      setMessages(prev => {
        // Deduplicate: skip if we already have this message by _id or tempId
        if (msg._id && prev.some(m => idMatch(m._id, msg._id))) return prev;
        if (msg.tempId && prev.some(m => m.tempId === msg.tempId)) {
          // Replace the optimistic message with the server-confirmed one
          return prev.map(m => m.tempId === msg.tempId ? { ...msg } : m);
        }
        return [...prev, msg];
      });

      // Mark as read immediately if it's from the friend
      if (idMatch(msg.senderId, friendId)) {
        api.put(`/dm/${friendId}/read`).catch(() => {});
      }
    };
    socket.on('dm_message', handler);
    return () => socket.off('dm_message', handler);
  }, [friendId, myId]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);

    // Generate a temp ID for optimistic update & deduplication
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Optimistic: add the message to the UI immediately
    const optimisticMsg = {
      _id: tempId,
      tempId,
      senderId: myId,
      receiverId: friendId,
      text: trimmed,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setText('');
    inputRef.current?.focus();

    try {
      // Send via REST API (more reliable than socket-only) — also triggers socket emit on server
      const res = await api.post('/dm/send', {
        receiverId: friendId,
        text: trimmed,
      });

      // Replace optimistic message with the server-confirmed one
      if (res.data?._id) {
        setMessages(prev =>
          prev.map(m => m.tempId === tempId ? { ...res.data } : m)
        );
      }
    } catch (err) {
      console.error('Send failed:', err);
      // Mark optimistic message as failed
      setMessages(prev =>
        prev.map(m => m.tempId === tempId ? { ...m, failed: true } : m)
      );
    }
    finally { setSending(false); }
  };

  const handleRetry = async (failedMsg) => {
    // Remove the failed message
    setMessages(prev => prev.filter(m => m.tempId !== failedMsg.tempId));
    // Resend
    setText(failedMsg.text);
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateSeparator = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDateKey = (dateStr) => new Date(dateStr).toDateString();

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-brand-gray-light bg-white/80 backdrop-blur-sm">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-brand-dark/5 transition-colors lg:hidden">
          <ArrowLeft className="h-5 w-5 text-brand-dark" />
        </button>
        <div className="h-10 w-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold overflow-hidden">
          {friend?.profilePhoto ? <img src={friend.profilePhoto} alt="" className="h-full w-full object-cover" /> : friend?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-display font-bold text-brand-dark text-sm">{friend?.name}</p>
            {friend?.isDriverVerified && (
              <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                <Shield className="h-2 w-2 text-white" />
              </div>
            )}
          </div>
          <p className="text-xs text-brand-muted">{friend?.email}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1" style={{ minHeight: 0 }}>
        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="loader-spinner" /></div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-center">
            <div>
              <MessageCircle className="h-10 w-10 mx-auto text-brand-muted/20 mb-3" />
              <p className="text-brand-muted text-sm">No messages yet. Say hello!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const isMine = idMatch(msg.senderId, myId);
              const showDate = i === 0 || getDateKey(msg.createdAt) !== getDateKey(messages[i - 1].createdAt);
              return (
                <React.Fragment key={msg._id || msg.tempId}>
                  {showDate && (
                    <div className="flex justify-center py-3">
                      <span className="px-3 py-1 bg-brand-dark/5 rounded-full text-[10px] font-display font-bold text-brand-muted uppercase tracking-wider">
                        {formatDateSeparator(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? 'bg-brand-dark text-white rounded-br-md'
                        : 'bg-white border border-brand-gray-light text-brand-dark rounded-bl-md'
                    } ${msg.failed ? 'opacity-60' : ''}`}>
                      <p>{msg.text}</p>
                      <div className={`flex items-center gap-1.5 mt-1 ${isMine ? 'justify-end' : ''}`}>
                        <p className={`text-[10px] ${isMine ? 'text-white/50' : 'text-brand-muted/50'}`}>{formatTime(msg.createdAt)}</p>
                        {msg.failed && (
                          <button onClick={() => handleRetry(msg)} className="text-[10px] text-red-300 hover:text-red-200 underline">
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-brand-gray-light bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-4 py-3 bg-brand-dark/[0.03] rounded-xl border-0 text-sm focus:ring-1 focus:ring-brand-accent outline-none transition-all"
            maxLength={2000}
          />
          <button type="submit" disabled={!text.trim() || sending}
            className="px-5 py-3 bg-brand-dark text-white rounded-xl font-display font-bold text-sm hover:bg-brand-accent hover:text-brand-dark transition-all disabled:opacity-30 flex items-center gap-2">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Main Messages Page ───────────────────────────────
export const Messages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedId, setSelectedId] = useState(userId || null);

  // If navigated with userId, load that friend's info
  useEffect(() => {
    if (userId) {
      setSelectedId(userId);
      setSelectedFriend({ _id: userId }); // Minimal placeholder until friend loads
      // Fetch friend details from friends list
      api.get(`/friends/list`).then(res => {
        const friend = res.data.find(f => idMatch(f._id, userId));
        if (friend) setSelectedFriend(friend);
      }).catch(() => {});
    }
  }, [userId]);

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setSelectedId(friend._id);
    navigate(`/messages/${friend._id}`, { replace: true });
  };

  const handleBack = () => {
    setSelectedFriend(null);
    setSelectedId(null);
    navigate('/messages', { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pt-28">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Messages</h1>
          <p className="text-brand-muted text-sm mt-0.5">Chat with your friends</p>
        </div>
      </div>

      {/* Chat Layout */}
      <div className="bg-white rounded-2xl border border-brand-gray-light overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="flex h-full">
          {/* Sidebar — Conversations */}
          <div className={`w-full lg:w-80 border-r border-brand-gray-light overflow-y-auto ${selectedFriend ? 'hidden lg:block' : 'block'}`}>
            <div className="p-4 border-b border-brand-gray-light">
              <h3 className="font-display font-bold text-brand-dark text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-accent" /> Conversations
              </h3>
            </div>
            <ConversationList onSelect={handleSelectFriend} selectedId={selectedId} />
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${selectedFriend ? 'block' : 'hidden lg:flex'}`}>
            {selectedFriend ? (
              <ChatView friendId={selectedId} friend={selectedFriend} onBack={handleBack} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto text-brand-muted/10 mb-4" />
                  <p className="font-display font-bold text-brand-dark text-lg">Select a conversation</p>
                  <p className="text-brand-muted text-sm mt-1">Choose a friend to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
