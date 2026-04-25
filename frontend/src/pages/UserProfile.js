import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import {
  User, Mail, Phone, Car, Star, Coins, Award, Shield, MapPin,
  Calendar, CheckCircle, TrendingUp, Users, MessageCircle,
  UserPlus, UserCheck, Clock, ChevronLeft, ArrowLeft, Heart,
  ExternalLink, X,
} from 'lucide-react';
import { format } from 'date-fns';

export const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews');
  const [actionLoading, setActionLoading] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);

  const isOwnProfile = currentUser?.id === userId;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/friends/profile/${userId}`);
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOwnProfile) {
      navigate('/profile', { replace: true });
      return;
    }
    fetchProfile();
  }, [userId, fetchProfile, isOwnProfile, navigate]);

  const sendFriendRequest = async () => {
    setActionLoading(true);
    try {
      await api.post('/friends/request', { recipientId: userId });
      fetchProfile();
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  const respondToRequest = async (status) => {
    if (!profile?.friendshipStatus?.friendshipId) return;
    setActionLoading(true);
    try {
      await api.put(`/friends/${profile.friendshipStatus.friendshipId}/respond`, { status });
      fetchProfile();
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  const removeFriend = async () => {
    if (!profile?.friendshipStatus?.friendshipId) return;
    setActionLoading(true);
    try {
      await api.delete(`/friends/${profile.friendshipStatus.friendshipId}`);
      fetchProfile();
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loader-spinner mx-auto mb-4" />
          <p className="text-brand-muted text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto text-brand-muted/30 mb-4" />
          <p className="text-brand-muted mb-4">User not found</p>
          <button onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-brand-dark text-white rounded-full text-sm font-display font-bold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { user: profileUser, friends, friendsCount, ratings, stats, friendshipStatus } = profile;
  const avgRating = profileUser.avgRating;
  const memberSince = profileUser.createdAt ? format(new Date(profileUser.createdAt), 'MMMM yyyy') : '';

  const tabs = [
    { key: 'reviews', label: 'Reviews', count: ratings.length },
    { key: 'friends', label: 'Friends', count: friendsCount },
  ];

  // Friendship action buttons
  const renderFriendshipAction = () => {
    if (isOwnProfile) return null;

    const fs = friendshipStatus;

    if (!fs || fs.status === 'none' || fs.status === 'rejected') {
      return (
        <button onClick={sendFriendRequest} disabled={actionLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-dark text-white rounded-full text-sm font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all disabled:opacity-50">
          <UserPlus className="h-4 w-4" /> {actionLoading ? 'Sending...' : 'Add Friend'}
        </button>
      );
    }

    if (fs.status === 'pending' && fs.isRequester) {
      return (
        <span className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-700 rounded-full text-sm font-bold">
          <Clock className="h-4 w-4" /> Request Sent
        </span>
      );
    }

    if (fs.status === 'pending' && !fs.isRequester) {
      return (
        <div className="flex items-center gap-2">
          <button onClick={() => respondToRequest('accepted')} disabled={actionLoading}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500 text-white rounded-full text-sm font-display font-bold hover:bg-emerald-600 transition-all">
            <CheckCircle className="h-4 w-4" /> Accept
          </button>
          <button onClick={() => respondToRequest('rejected')} disabled={actionLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 rounded-full text-sm font-display font-bold hover:bg-red-100 transition-all">
            <X className="h-4 w-4" /> Decline
          </button>
        </div>
      );
    }

    if (fs.status === 'accepted') {
      return (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold">
            <UserCheck className="h-4 w-4" /> Friends
          </span>
          <button onClick={() => navigate(`/messages/${userId}`)}
            className="p-2.5 rounded-xl bg-brand-dark/5 hover:bg-brand-accent/10 text-brand-dark hover:text-brand-accent transition-all" title="Message">
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* Back button */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-brand-muted hover:text-brand-dark text-sm font-display font-bold mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* ═══════ Profile Header Card ═══════ */}
      <div className="bg-white rounded-3xl border border-brand-gray-light mb-6">
        {/* Banner */}
        <div className="h-40 sm:h-48 relative overflow-hidden rounded-t-3xl" style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)',
        }}>
          {/* Animated gradient orbs */}
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(232,168,56,0.5) 0%, transparent 70%)',
              left: '-5%', top: '-40%', filter: 'blur(50px)',
              animation: 'profileOrb1 8s ease-in-out infinite',
            }}
          />
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
              right: '-5%', bottom: '-30%', filter: 'blur(50px)',
              animation: 'profileOrb2 10s ease-in-out infinite',
            }}
          />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />

          {/* Road animation */}
          <div className="absolute bottom-5 left-0 right-0 h-[2px] bg-white/10">
            <div className="absolute inset-0" style={{
              background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 12px, transparent 12px, transparent 28px)',
              animation: 'roadDash 1.2s linear infinite',
            }} />
          </div>

          {/* Animated car */}
          <div className="absolute bottom-[10px]" style={{ animation: 'bannerCar 6s linear infinite' }}>
            <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
              <path d="M3 8h1l1.5-4h8L16 8h5a2 2 0 012 2v1a1 1 0 01-1 1H2a1 1 0 01-1-1v-1a2 2 0 012-2z" fill="rgba(232,168,56,0.7)"/>
              <circle cx="6" cy="12" r="1.5" fill="rgba(232,168,56,0.9)"/>
              <circle cx="18" cy="12" r="1.5" fill="rgba(232,168,56,0.9)"/>
            </svg>
          </div>

          {/* Stars */}
          {[
            { top: '15%', left: '10%', delay: '0s', size: 2 },
            { top: '25%', left: '35%', delay: '1s', size: 1.5 },
            { top: '12%', left: '55%', delay: '2s', size: 2 },
            { top: '30%', left: '75%', delay: '0.5s', size: 1 },
            { top: '18%', left: '90%', delay: '1.5s', size: 1.5 },
          ].map((star, i) => (
            <div key={i} className="absolute rounded-full bg-white" style={{
              width: star.size, height: star.size,
              top: star.top, left: star.left,
              animation: `starTwinkle 3s ease-in-out ${star.delay} infinite`,
            }} />
          ))}

          <style>{`
            @keyframes profileOrb1 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(30px, 10px) scale(1.1); }
            }
            @keyframes profileOrb2 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-20px, -15px) scale(1.15); }
            }
            @keyframes roadDash {
              from { transform: translateX(0); }
              to { transform: translateX(-28px); }
            }
            @keyframes bannerCar {
              0% { left: -30px; opacity: 0; }
              5% { opacity: 0.7; }
              95% { opacity: 0.7; }
              100% { left: calc(100% + 10px); opacity: 0; }
            }
            @keyframes starTwinkle {
              0%, 100% { opacity: 0.2; }
              50% { opacity: 0.8; }
            }
          `}</style>
        </div>

        {/* Profile Info */}
        <div className="px-6 sm:px-8 pb-8 -mt-14 relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <div className="h-28 w-28 rounded-3xl bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center flex-shrink-0">
              {profileUser.profilePhoto ? (
                <img src={profileUser.profilePhoto} alt={profileUser.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-brand-accent/20 to-indigo-100 flex items-center justify-center">
                  <span className="text-4xl font-display font-black text-brand-accent">
                    {profileUser.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info + Actions */}
            <div className="flex-1 pt-16 sm:pt-16 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl font-bold text-brand-dark">{profileUser.name}</h1>
                    {profileUser.isDriverVerified && (
                      <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center" title="Verified Driver">
                        <Shield className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-brand-muted text-sm mt-1 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> {profileUser.email}
                  </p>
                  {memberSince && (
                    <p className="text-brand-muted/60 text-xs mt-1 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> Member since {memberSince}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {renderFriendshipAction()}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {profileUser.isDriverVerified && (
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-bold flex items-center gap-1">
                    <Car className="h-3 w-3" /> Verified Driver
                  </span>
                )}
                <span className="px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-700 font-bold flex items-center gap-1">
                  <Coins className="h-3 w-3" /> {profileUser.coins || 0} Coins
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1">
                  <Star className="h-3 w-3" /> {avgRating || 'N/A'} Rating
                </span>
              </div>

              {/* Instagram-style counters */}
              <div className="flex gap-8 mt-5 pt-4 border-t border-brand-gray-light">
                <div className="text-center">
                  <p className="text-xl font-display font-black text-brand-dark">{stats.ridesOffered + stats.requestsMade}</p>
                  <p className="text-xs text-brand-muted">Rides</p>
                </div>
                <button onClick={() => setShowFriendsModal(true)} className="text-center hover:opacity-70 transition-opacity">
                  <p className="text-xl font-display font-black text-brand-dark">{friendsCount}</p>
                  <p className="text-xs text-brand-muted">Friends</p>
                </button>
                <div className="text-center">
                  <p className="text-xl font-display font-black text-brand-dark">{ratings.length}</p>
                  <p className="text-xs text-brand-muted">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-display font-black text-brand-dark">{avgRating || '—'}</p>
                  <p className="text-xs text-brand-muted">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ Stats Grid ═══════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Rides Offered', value: stats.ridesOffered, icon: Car, color: 'bg-blue-500' },
          { label: 'Rides Completed', value: stats.ridesCompleted, icon: CheckCircle, color: 'bg-emerald-500' },
          { label: 'Bookings Made', value: stats.requestsMade, icon: TrendingUp, color: 'bg-violet-500' },
          { label: 'Bookings Done', value: stats.requestsCompleted, icon: Award, color: 'bg-amber-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-brand-gray-light p-4 sm:p-5 card-lift">
            <div className={`h-9 w-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="h-4 w-4 text-white" />
            </div>
            <p className="text-xl sm:text-2xl font-display font-black text-brand-dark">{s.value}</p>
            <p className="text-xs text-brand-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ═══════ Tabs ═══════ */}
      <div className="flex gap-1 mb-6">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-display font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.key ? 'bg-brand-dark text-white shadow-lg' : 'text-brand-muted hover:bg-brand-dark/5 hover:text-brand-dark'
            }`}>
            {tab.key === 'reviews' ? <Star className="h-4 w-4" /> : <Users className="h-4 w-4" />}
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-brand-accent/10 text-brand-accent'
              }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════ Reviews Tab ═══════ */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-brand-gray-light p-6">
          <h2 className="font-display font-bold text-lg text-brand-dark mb-5 flex items-center gap-2">
            <Star className="h-5 w-5 text-brand-accent" /> Reviews ({ratings.length})
          </h2>
          {ratings.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-10 w-10 mx-auto text-brand-muted/20 mb-3" />
              <p className="text-brand-muted text-sm">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ratings.map(r => (
                <div key={r._id} className="bg-brand-dark/[0.02] rounded-xl p-4 flex items-start gap-4 hover:bg-brand-dark/[0.04] transition-colors">
                  <Link to={`/user/${r.raterId?._id}`}
                    className="h-10 w-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-sm flex-shrink-0 overflow-hidden hover:ring-2 hover:ring-brand-accent/30 transition-all">
                    {r.raterId?.profilePhoto ? (
                      <img src={r.raterId.profilePhoto} alt="" className="h-full w-full object-cover" />
                    ) : (
                      r.raterId?.name?.charAt(0)?.toUpperCase()
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link to={`/user/${r.raterId?._id}`} className="font-semibold text-sm text-brand-dark hover:text-brand-accent transition-colors">
                        {r.raterId?.name || 'Anonymous'}
                      </Link>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-brand-muted">{r.review || 'No written review'}</p>
                    <p className="text-xs text-brand-muted/60 mt-1">{format(new Date(r.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════ Friends Tab ═══════ */}
      {activeTab === 'friends' && (
        <div className="bg-white rounded-2xl border border-brand-gray-light p-6">
          <h2 className="font-display font-bold text-lg text-brand-dark mb-5 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" /> Friends ({friendsCount})
          </h2>
          {friends.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-10 w-10 mx-auto text-brand-muted/20 mb-3" />
              <p className="text-brand-muted text-sm">No friends yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {friends.map(f => (
                <Link to={`/user/${f._id}`} key={f._id}
                  className="flex items-center gap-3 p-4 rounded-xl bg-brand-dark/[0.02] hover:bg-brand-dark/[0.05] transition-all group">
                  <div className="h-11 w-11 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold flex-shrink-0 overflow-hidden">
                    {f.profilePhoto ? (
                      <img src={f.profilePhoto} alt="" className="h-full w-full object-cover" />
                    ) : (
                      f.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-display font-semibold text-sm text-brand-dark truncate group-hover:text-brand-accent transition-colors">{f.name}</p>
                      {f.isDriverVerified && (
                        <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-brand-muted/40 group-hover:text-brand-accent transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════ Friends Modal (Instagram-style popup) ═══════ */}
      {showFriendsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowFriendsModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[70vh] overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-brand-gray-light">
              <h3 className="font-display font-bold text-brand-dark">Friends</h3>
              <button onClick={() => setShowFriendsModal(false)}
                className="p-1.5 rounded-full hover:bg-brand-dark/5 transition-colors">
                <X className="h-5 w-5 text-brand-muted" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[55vh] p-3">
              {friends.length === 0 ? (
                <p className="text-center text-brand-muted text-sm py-8">No friends yet</p>
              ) : (
                <div className="space-y-1">
                  {friends.map(f => (
                    <Link to={`/user/${f._id}`} key={f._id}
                      onClick={() => setShowFriendsModal(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-dark/[0.03] transition-all group">
                      <div className="h-11 w-11 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold flex-shrink-0 overflow-hidden">
                        {f.profilePhoto ? (
                          <img src={f.profilePhoto} alt="" className="h-full w-full object-cover" />
                        ) : (
                          f.name?.charAt(0)?.toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-display font-semibold text-sm text-brand-dark group-hover:text-brand-accent transition-colors">{f.name}</p>
                          {f.isDriverVerified && (
                            <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                              <Shield className="h-2 w-2 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
