import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { socket } from '../lib/socket';
import api from '../lib/api';
import {
  Gift, Send, Heart, Bookmark, Star, Trophy, Award,
  Sparkles, ChevronRight, X, Search, Loader2, ExternalLink
} from 'lucide-react';

// ─── Gift Type Color Map ────────────────────────────
const MOOD_EMOJI = { joyful: '😄', grateful: '🙏', proud: '💪', supportive: '🤗', playful: '😜' };
const REACTION_EMOJI = { loved: '❤️', moved: '🥺', laughing: '😂' };

// ─── Send Gift Modal ────────────────────────────────
const SendGiftModal = ({ show, onClose, targetUser, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [types, setTypes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [coins, setCoins] = useState(10);
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState(null);
  const [isAnon, setIsAnon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState(targetUser?.id || '');
  const [searchResults, setSearchResults] = useState([]);
  const [receiver, setReceiver] = useState(targetUser || null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!show) return;
    setStep(targetUser ? 2 : 1);
    setSelected(null); setCoins(10); setMessage(''); setMood(null);
    setError(''); setResult(null); setReceiver(targetUser || null);
    api.get('/gifts/types').then(r => setTypes(r.data.data || [])).catch(() => {});
  }, [show, targetUser]);

  const searchUsers = async (q) => {
    if (q.length < 2) { setSearchResults([]); return; }
    try {
      const r = await api.get(`/friends/search?q=${encodeURIComponent(q)}`);
      setSearchResults(r.data.users || r.data || []);
    } catch { setSearchResults([]); }
  };

  const handleSend = async () => {
    if (!receiver || !selected) return;
    setLoading(true); setError('');
    try {
      const r = await api.post('/gifts/send', {
        receiver_id: receiver.id || receiver._id,
        coin_value: coins,
        gift_type_key: selected.key,
        message, mood_tag: mood,
        is_anonymous: isAnon, is_public: true,
      });
      setResult(r.data.data);
      setStep(4);
      onSuccess?.();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to send gift');
    } finally { setLoading(false); }
  };

  if (!show) return null;

  const grouped = types.reduce((a, t) => {
    (a[t.category] = a[t.category] || []).push(t); return a;
  }, {});

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ border: selected ? `2px solid ${selected.colorHex}` : '2px solid #e5e5e5' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100"
          style={{ background: selected ? `linear-gradient(135deg, ${selected.colorHex}15, transparent)` : '' }}>
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-500" />
            <h3 className="font-display font-bold text-lg">
              {step === 1 ? 'Choose Recipient' : step === 2 ? 'Pick a Gift' : step === 3 ? 'Confirm' : 'Sent! 🎉'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-4 overflow-y-auto" style={{ maxHeight: '65vh' }}>
          {error && <div className="mb-3 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

          {/* Step 1: Pick Receiver */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                  placeholder="Search by name..." value={searchId}
                  onChange={e => { setSearchId(e.target.value); searchUsers(e.target.value); }} />
              </div>
              {searchResults.map(u => (
                <button key={u._id} onClick={() => { setReceiver({ id: u._id, name: u.name, profilePhoto: u.profilePhoto }); setStep(2); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 border border-gray-100 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
                    {u.profilePhoto ? <img src={u.profilePhoto} alt="" className="h-full w-full object-cover" /> : <span className="text-lg">{u.name?.[0]}</span>}
                  </div>
                  <span className="font-medium text-sm">{u.name}</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-300" />
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Pick Gift Type */}
          {step === 2 && (
            <div className="space-y-4">
              {receiver && (
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-xl">
                  <span className="text-xs text-amber-700">To: <b>{receiver.name}</b></span>
                </div>
              )}
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{cat}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {items.map(t => (
                      <button key={t.key} onClick={() => { setSelected(t); setCoins(t.minCoins); setStep(3); }}
                        className={`p-3 rounded-xl border-2 text-center transition-all hover:scale-105 ${selected?.key === t.key ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}>
                        <span className="text-2xl block mb-1">{t.icon}</span>
                        <span className="text-[11px] font-medium block leading-tight">{t.displayName}</span>
                        <span className="text-[10px] text-gray-400">{t.minCoins}+ coins</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Configure & Confirm */}
          {step === 3 && selected && (
            <div className="space-y-4">
              <div className="text-center p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${selected.colorHex}20, ${selected.colorHex}05)` }}>
                <span className="text-4xl block mb-2 gift-bounce">{selected.icon}</span>
                <p className="font-bold" style={{ color: selected.colorHex }}>{selected.displayName}</p>
                <p className="text-xs text-gray-500">To {receiver?.name}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Coins</label>
                <input type="range" min={selected.minCoins} max={selected.maxCoins || 500} value={coins}
                  onChange={e => setCoins(Number(e.target.value))}
                  className="w-full mt-1 accent-amber-500" />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{selected.minCoins}</span>
                  <span className="font-bold text-amber-600 text-lg">{coins} 🪙</span>
                  <span>{selected.maxCoins || '500'}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                <textarea className="w-full mt-1 p-3 rounded-xl border border-gray-200 text-sm resize-none focus:border-amber-400 outline-none"
                  rows={3} maxLength={500} placeholder="Write something kind..."
                  value={message} onChange={e => setMessage(e.target.value)} />
                <p className="text-[10px] text-gray-400 text-right">{message.length}/500</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Mood</label>
                <div className="flex gap-2 mt-1">
                  {Object.entries(MOOD_EMOJI).map(([k, v]) => (
                    <button key={k} onClick={() => setMood(mood === k ? null : k)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${mood === k ? 'bg-amber-100 border-amber-300' : 'border-gray-200 hover:border-gray-300'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={isAnon} onChange={e => setIsAnon(e.target.checked)}
                  className="rounded accent-amber-500" />
                Send anonymously
              </label>

              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Back</button>
                <button onClick={handleSend} disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${selected.colorHex}, ${selected.colorHex}cc)` }}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : `Send ${coins} coins`}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && result && (
            <div className="text-center py-6 space-y-4">
              <div className="text-5xl gift-bounce">🎁</div>
              <h3 className="font-display font-bold text-xl">Gift Sent!</h3>
              <div className="p-4 bg-amber-50 rounded-xl space-y-2">
                <p className="text-sm"><b>Reputation:</b> {result.sender_new_reputation} pts</p>
                <p className="text-sm"><b>Badge:</b> {result.badge_progress?.current}</p>
                {result.badge_progress?.next && (
                  <div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${result.badge_progress.progressPct}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{result.badge_progress.progressPct}% to {result.badge_progress.next}</p>
                  </div>
                )}
                <p className="text-sm"><b>Balance:</b> {result.wallet_balance_remaining} coins</p>
              </div>
              <button onClick={onClose} className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Gift Card Component ────────────────────────────
const GiftCard = ({ gift, isReceived, onAction }) => {
  const gt = gift.giftTypeId || {};
  const person = isReceived ? gift.senderId : gift.receiverId;
  const isUnopened = isReceived && !gift.openedAt;

  return (
    <div className={`group relative p-4 rounded-2xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${isUnopened ? 'border-amber-300 bg-amber-50/50 gift-pulse' : 'border-gray-100 bg-white'}`}
      style={!isUnopened ? { borderLeftColor: gt.colorHex, borderLeftWidth: '4px' } : {}}>
      {isUnopened && <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-amber-400 animate-pulse" />}
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${gt.colorHex || '#f59e0b'}20` }}>
          {gt.icon || '🎁'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm truncate">{person?.name || 'Anonymous'}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${gt.colorHex}20`, color: gt.colorHex }}>
              {gt.displayName}
            </span>
          </div>
          {isUnopened ? (
            <button onClick={() => onAction('open', gift._id)} className="mt-2 px-4 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors">
              🎁 Open Gift
            </button>
          ) : (
            <>
              {gift.message && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{gift.message}</p>}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                <span className="font-bold text-amber-600">{gift.coinValue} 🪙</span>
                {gift.moodTag && <span>{MOOD_EMOJI[gift.moodTag]}</span>}
                {gift.receiverReaction && <span>{REACTION_EMOJI[gift.receiverReaction]}</span>}
                <span>{new Date(gift.createdAt).toLocaleDateString()}</span>
              </div>
            </>
          )}
        </div>
      </div>
      {isReceived && !isUnopened && (
        <div className="flex gap-1 mt-3 pt-3 border-t border-gray-50">
          {Object.entries(REACTION_EMOJI).map(([k, v]) => (
            <button key={k} onClick={() => onAction('react', gift._id, k)}
              className={`px-2 py-1 rounded-lg text-sm transition-all ${gift.receiverReaction === k ? 'bg-amber-100 scale-110' : 'hover:bg-gray-100'}`}>{v}</button>
          ))}
          <button onClick={() => onAction('bookmark', gift._id)}
            className={`ml-auto p-1 rounded-lg transition-all ${gift.bookmarkedAt ? 'text-amber-500' : 'text-gray-300 hover:text-gray-500'}`}>
            <Bookmark className="h-4 w-4" fill={gift.bookmarkedAt ? 'currentColor' : 'none'} />
          </button>
          <button onClick={() => onAction('showcase', gift._id)}
            className={`p-1 rounded-lg transition-all ${gift.showcasedAt ? 'text-purple-500' : 'text-gray-300 hover:text-gray-500'}`}>
            <Star className="h-4 w-4" fill={gift.showcasedAt ? 'currentColor' : 'none'} />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Main Gifts Page ────────────────────────────────
export const Gifts = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('received');
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSend, setShowSend] = useState(false);
  const [rep, setRep] = useState(null);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchGifts = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'received' ? '/gifts/received' : '/gifts/sent';
      const params = `?page=${page}&limit=20${filter !== 'all' ? `&filter=${filter}` : ''}`;
      const r = await api.get(endpoint + params);
      setGifts(page === 1 ? r.data.data : prev => [...prev, ...r.data.data]);
      setHasMore(r.data.meta?.hasMore || false);
    } catch {} finally { setLoading(false); }
  }, [tab, page, filter]);

  const fetchRep = useCallback(async () => {
    try { const r = await api.get('/gifts/reputation'); setRep(r.data.data); } catch {}
  }, []);

  useEffect(() => { fetchGifts(); }, [fetchGifts]);
  useEffect(() => { fetchRep(); }, [fetchRep]);
  useEffect(() => { setPage(1); setGifts([]); }, [tab, filter]);

  // Real-time gift received
  useEffect(() => {
    const handler = (data) => {
      if (tab === 'received') { setPage(1); fetchGifts(); }
      fetchRep();
    };
    socket.on('gift_received', handler);
    return () => socket.off('gift_received', handler);
  }, [tab, fetchGifts, fetchRep]);

  const handleAction = async (action, giftId, extra) => {
    try {
      if (action === 'open') {
        await api.patch(`/gifts/${giftId}/open`);
      } else if (action === 'bookmark') {
        await api.patch(`/gifts/${giftId}/bookmark`);
      } else if (action === 'showcase') {
        await api.patch(`/gifts/${giftId}/showcase`);
      } else if (action === 'react') {
        await api.post(`/gifts/${giftId}/react`, { reaction: extra });
      }
      fetchGifts();
    } catch {}
  };

  const progress = rep?.badgeProgress || {};
  const unopened = gifts.filter(g => !g.openedAt).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl">Gifts</h1>
          <p className="text-sm text-gray-500 mt-1">Send appreciation, earn reputation</p>
        </div>
        <button onClick={() => setShowSend(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all">
          <Send className="h-4 w-4" /> Send Gift
        </button>
      </div>

      {/* Reputation Card */}
      {rep && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white mb-6">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{rep.totalReputation}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Reputation</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{rep.badgeTier}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Badge</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{rep.giftsSentCount || 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Gifts Sent</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">🔥 {rep.giftingStreakDays || 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Streak</p>
            </div>
            {progress.next && (
              <div className="flex-1 min-w-[120px]">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>{progress.current}</span><span>{progress.next}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700"
                    style={{ width: `${progress.progressPct}%` }} />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">{progress.progressPct}% complete</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4">
        {['received', 'sent'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'received' ? `Received${unopened > 0 && tab === 'received' ? ` (${unopened} new)` : ''}` : 'Sent'}
          </button>
        ))}
      </div>

      {/* Filters */}
      {tab === 'received' && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {['all', 'unopened', 'bookmarked', 'showcased'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === f ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Gift List */}
      {loading && page === 1 ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
      ) : gifts.length === 0 ? (
        <div className="text-center py-16">
          <Gift className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No gifts yet</p>
          <p className="text-sm text-gray-400 mt-1">{tab === 'received' ? 'Gifts you receive will appear here' : 'Start sending gifts to build reputation!'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {gifts.map(g => <GiftCard key={g._id} gift={g} isReceived={tab === 'received'} onAction={handleAction} />)}
          {hasMore && (
            <button onClick={() => setPage(p => p + 1)} disabled={loading}
              className="w-full py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 font-medium">
              {loading ? 'Loading...' : 'Load more'}
            </button>
          )}
        </div>
      )}

      <SendGiftModal show={showSend} onClose={() => setShowSend(false)} onSuccess={() => { fetchGifts(); fetchRep(); updateUser({ coins: user.coins }); }} />
    </div>
  );
};

export default Gifts;
