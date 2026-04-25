import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { socket } from '../lib/socket';
import {
  Users, Search, UserPlus, UserCheck, UserX, Check, X, MessageCircle,
  Shield, Clock, Send, Trash2, ChevronRight
} from 'lucide-react';

export const Friends = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [sent, setSent] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchFriends = useCallback(async () => {
    setLoading(true);
    try {
      const [friendsRes, pendingRes, sentRes] = await Promise.all([
        api.get('/friends/list'),
        api.get('/friends/pending'),
        api.get('/friends/sent'),
      ]);
      setFriends(friendsRes.data);
      setPending(pendingRes.data);
      setSent(sentRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchFriends(); }, [fetchFriends]);

  // Real-time friend request/response
  useEffect(() => {
    const handleRequest = () => fetchFriends();
    const handleResponse = () => fetchFriends();
    socket.on('friend_request', handleRequest);
    socket.on('friend_response', handleResponse);
    return () => {
      socket.off('friend_request', handleRequest);
      socket.off('friend_response', handleResponse);
    };
  }, [fetchFriends]);

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    try {
      const res = await api.get(`/friends/search?q=${encodeURIComponent(q)}`);
      setSearchResults(res.data);
    } catch (err) { console.error(err); }
    finally { setSearchLoading(false); }
  };

  const sendRequest = async (recipientId) => {
    try {
      await api.post('/friends/request', { recipientId });
      fetchFriends();
      if (searchQuery) handleSearch(searchQuery);
    } catch (err) { console.error(err); }
  };

  const respondToRequest = async (id, status) => {
    try {
      await api.put(`/friends/${id}/respond`, { status });
      fetchFriends();
    } catch (err) { console.error(err); }
  };

  const removeFriend = async (friendshipId) => {
    try {
      await api.delete(`/friends/${friendshipId}`);
      fetchFriends();
    } catch (err) { console.error(err); }
  };

  const tabs = [
    { key: 'friends', label: 'My Friends', icon: Users, count: friends.length },
    { key: 'pending', label: 'Requests', icon: Clock, count: pending.length },
    { key: 'search', label: 'Find Friends', icon: Search },
  ];

  const VerifiedBadge = ({ verified }) => verified ? (
    <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center" title="Verified Driver">
      <Shield className="h-2.5 w-2.5 text-white" />
    </div>
  ) : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 lg:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-dark">Friends</h1>
            <p className="text-brand-muted text-sm mt-0.5">Connect with KindLift users</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-display font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.key ? 'bg-brand-dark text-white shadow-lg' : 'text-brand-muted hover:bg-brand-dark/5 hover:text-brand-dark'
            }`}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-brand-accent/10 text-brand-accent'
              }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Friends List ─────────────────────────────────── */}
      {activeTab === 'friends' && (
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-full max-w-sm mx-auto"><SkeletonLoader type="profile" count={3} /></div>
            </div>
          ) : friends.length === 0 ? (
            <div className="bg-white rounded-2xl border border-brand-gray-light p-16 text-center">
              <Users className="h-10 w-10 mx-auto text-brand-muted/30 mb-4" />
              <p className="text-brand-muted mb-4">You haven't connected with anyone yet</p>
              <button onClick={() => setActiveTab('search')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-white rounded-full text-sm font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all">
                <Search className="h-4 w-4" /> Find Friends
              </button>
            </div>
          ) : (
            friends.map(f => (
              <div key={f.friendshipId} className="bg-white rounded-2xl border border-brand-gray-light p-5 flex items-center justify-between card-lift">
                <Link to={`/user/${f._id}`} className="flex items-center gap-4 flex-1 min-w-0 group">
                  <div className="h-12 w-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-lg overflow-hidden flex-shrink-0 group-hover:ring-2 group-hover:ring-brand-accent/30 transition-all">
                    {f.profilePhoto ? <img src={f.profilePhoto} alt="" className="h-full w-full object-cover" /> : f.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display font-bold text-brand-dark group-hover:text-brand-accent transition-colors">{f.name}</p>
                      <VerifiedBadge verified={f.isDriverVerified} />
                    </div>
                    <p className="text-xs text-brand-muted truncate">{f.email}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate(`/messages/${f._id}`)} title="Message"
                    className="p-2.5 rounded-xl bg-brand-dark/5 hover:bg-brand-accent/10 text-brand-dark hover:text-brand-accent transition-all">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                  <button onClick={() => removeFriend(f.friendshipId)} title="Remove"
                    className="p-2.5 rounded-xl hover:bg-red-50 text-brand-muted hover:text-red-500 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── Pending Requests ─────────────────────────────── */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          {/* Incoming */}
          <div>
            <h3 className="font-display font-bold text-brand-dark mb-4 flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-brand-accent" /> Incoming Requests
              {pending.length > 0 && <span className="px-2 py-0.5 text-xs bg-brand-accent/10 text-brand-accent rounded-full font-bold">{pending.length}</span>}
            </h3>
            {pending.length === 0 ? (
              <div className="bg-white rounded-2xl border border-brand-gray-light p-10 text-center">
                <p className="text-brand-muted text-sm">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map(r => (
                  <div key={r._id} className="bg-white rounded-2xl border border-brand-gray-light p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold overflow-hidden">
                        {r.requester.profilePhoto ? <img src={r.requester.profilePhoto} alt="" className="h-full w-full object-cover" /> : r.requester.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-display font-semibold text-brand-dark">{r.requester.name}</p>
                          <VerifiedBadge verified={r.requester.isDriverVerified} />
                        </div>
                        <p className="text-xs text-brand-muted">{r.requester.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => respondToRequest(r._id, 'accepted')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-full text-xs font-display font-bold hover:bg-emerald-600 transition-all">
                        <Check className="h-3.5 w-3.5" /> Accept
                      </button>
                      <button onClick={() => respondToRequest(r._id, 'rejected')}
                        className="p-2 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition-all">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sent */}
          <div>
            <h3 className="font-display font-bold text-brand-dark mb-4 flex items-center gap-2">
              <Send className="h-4 w-4 text-brand-muted" /> Sent Requests
            </h3>
            {sent.length === 0 ? (
              <div className="bg-white rounded-2xl border border-brand-gray-light p-10 text-center">
                <p className="text-brand-muted text-sm">No sent requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sent.map(r => (
                  <div key={r._id} className="bg-white rounded-2xl border border-brand-gray-light p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                        {r.recipient.profilePhoto ? <img src={r.recipient.profilePhoto} alt="" className="h-full w-full object-cover" /> : r.recipient.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-display font-semibold text-brand-dark">{r.recipient.name}</p>
                        <p className="text-xs text-brand-muted">Pending...</p>
                      </div>
                    </div>
                    <button onClick={() => removeFriend(r._id)}
                      className="px-4 py-2 text-xs font-display font-bold text-brand-muted hover:text-red-500 border border-brand-gray-light rounded-full hover:border-red-200 transition-all">
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Search / Find Friends ────────────────────────── */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-muted" />
            <input type="text" placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-brand-gray-light text-sm focus:border-brand-accent focus:ring-0 outline-none transition-colors"
            />
          </div>
          {searchLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-full max-w-sm mx-auto"><SkeletonLoader type="profile" count={3} /></div>
            </div>
          ) : searchResults.length === 0 ? (
            searchQuery.length >= 2 && (
              <div className="bg-white rounded-2xl border border-brand-gray-light p-10 text-center">
                <UserX className="h-8 w-8 mx-auto text-brand-muted/30 mb-3" />
                <p className="text-brand-muted text-sm">No users found for "{searchQuery}"</p>
              </div>
            )
          ) : (
            <div className="space-y-3">
              {searchResults.map(u => {
                const fs = u.friendship;
                return (
                  <div key={u._id} className="bg-white rounded-2xl border border-brand-gray-light p-5 flex items-center justify-between card-lift">
                    <Link to={`/user/${u._id}`} className="flex items-center gap-4 flex-1 min-w-0 group">
                      <div className="h-12 w-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-lg overflow-hidden flex-shrink-0 group-hover:ring-2 group-hover:ring-brand-accent/30 transition-all">
                        {u.profilePhoto ? <img src={u.profilePhoto} alt="" className="h-full w-full object-cover" /> : u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-display font-bold text-brand-dark group-hover:text-brand-accent transition-colors">{u.name}</p>
                          <VerifiedBadge verified={u.isDriverVerified} />
                        </div>
                        <p className="text-xs text-brand-muted truncate">{u.email}</p>
                      </div>
                    </Link>
                    <div>
                      {!fs ? (
                        <button onClick={() => sendRequest(u._id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-brand-dark text-white rounded-full text-xs font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all">
                          <UserPlus className="h-3.5 w-3.5" /> Add Friend
                        </button>
                      ) : fs.status === 'accepted' ? (
                        <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                          <UserCheck className="h-3.5 w-3.5" /> Friends
                        </span>
                      ) : fs.status === 'pending' ? (
                        <span className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">
                          <Clock className="h-3.5 w-3.5" /> {fs.isRequester ? 'Request Sent' : 'Respond'}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
