import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { useAlert } from '../components/CustomAlert';
import {
  User, Mail, Phone, Car, Star, Coins, Award, Shield, Camera,
  MapPin, Calendar, CheckCircle, TrendingUp, Edit3, Save, X,
} from 'lucide-react';
import { format } from 'date-fns';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast, success: showSuccess } = useAlert();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', profilePhoto: '' });
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({ ridesOffered: 0, ridesCompleted: 0, requestsMade: 0, requestsCompleted: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', phone: user.phone || '', profilePhoto: user.profilePhoto || user.photo || '' });
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [ratingsRes, offersRes, requestsRes] = await Promise.all([
        api.get(`/ratings/user/${user.id}`),
        api.get('/rides/my-offers'),
        api.get('/requests/my-requests'),
      ]);
      setRatings(ratingsRes.data);
      setStats({
        ridesOffered: offersRes.data.length,
        ridesCompleted: offersRes.data.filter(r => r.status === 'completed').length,
        requestsMade: requestsRes.data.length,
        requestsCompleted: requestsRes.data.filter(r => r.status === 'completed').length,
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const photoInputRef = React.useRef(null);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast('warning', 'Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setFormData(p => ({ ...p, profilePhoto: base64 }));
      // Immediately save photo to backend
      try {
        const res = await api.put('/auth/update-profile', { profilePhoto: base64 });
        updateUser(res.data);
        toast('success', 'Profile photo updated!');
      } catch (err) {
        toast('error', 'Failed to update photo');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/auth/update-profile', {
        name: formData.name,
        phone: formData.phone,
        profilePhoto: formData.profilePhoto,
      });
      updateUser(res.data);
      setEditing(false);
      showSuccess('Profile updated successfully!', 'Profile Saved');
    } catch (err) { toast('error', 'Failed to save profile'); }
    finally { setSaving(false); }
  };

  const avgRating = user?.totalRatings > 0 ? (user.ratingSum / user.totalRatings).toFixed(1) : 'N/A';

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6 lg:py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-brand-gray-light overflow-hidden mb-8">
        {/* ── Kindlift Profile Banner ── */}
        <div className="h-44 sm:h-48 relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)',
        }}>
          {/* Animated gradient orbs */}
          <div className="absolute w-[400px] h-[400px] rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(232,168,56,0.5) 0%, transparent 70%)',
              left: '-5%', top: '-40%', filter: 'blur(50px)',
              animation: 'bannerOrb1 8s ease-in-out infinite',
            }}
          />
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
              right: '-5%', bottom: '-30%', filter: 'blur(50px)',
              animation: 'bannerOrb2 10s ease-in-out infinite',
            }}
          />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />

          {/* City skyline silhouette */}
          <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1200 100" fill="none" preserveAspectRatio="none" style={{ height: '60px', opacity: 0.08 }}>
            <path d="M0,100 L0,70 L40,70 L40,55 L60,55 L60,45 L80,45 L80,60 L120,60 L120,40 L130,40 L130,30 L145,30 L145,40 L160,40 L160,55 L200,55 L200,50 L220,50 L220,35 L235,35 L235,25 L250,25 L250,35 L270,35 L270,55 L300,55 L300,65 L340,65 L340,45 L360,45 L360,30 L375,30 L375,20 L395,20 L395,30 L410,30 L410,45 L440,45 L440,60 L480,60 L480,50 L510,50 L510,35 L530,35 L530,40 L560,40 L560,55 L600,55 L600,45 L620,45 L620,30 L640,30 L640,20 L660,15 L680,20 L680,30 L700,30 L700,50 L740,50 L740,55 L780,55 L780,40 L800,40 L800,25 L820,25 L820,35 L850,35 L850,50 L880,50 L880,60 L920,60 L920,45 L940,45 L940,35 L960,35 L960,50 L1000,50 L1000,55 L1040,55 L1040,40 L1060,40 L1060,30 L1080,30 L1080,45 L1120,45 L1120,60 L1160,60 L1160,70 L1200,70 L1200,100 Z" fill="white"/>
          </svg>

          {/* Animated road with dashes */}
          <div className="absolute bottom-5 left-0 right-0 h-[2px] bg-white/10">
            <div className="absolute inset-0" style={{
              background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 12px, transparent 12px, transparent 28px)',
              animation: 'roadDash 1.2s linear infinite',
            }} />
          </div>

          {/* Small animated car on the road */}
          <div className="absolute bottom-[10px]" style={{ animation: 'bannerCar 6s linear infinite' }}>
            <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
              <path d="M3 8h1l1.5-4h8L16 8h5a2 2 0 012 2v1a1 1 0 01-1 1H2a1 1 0 01-1-1v-1a2 2 0 012-2z" fill="rgba(232,168,56,0.7)"/>
              <circle cx="6" cy="12" r="1.5" fill="rgba(232,168,56,0.9)"/>
              <circle cx="18" cy="12" r="1.5" fill="rgba(232,168,56,0.9)"/>
              <path d="M7 4.5L8.5 1h7L17 4.5" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
            </svg>
          </div>

          {/* Stars / dots */}
          {[
            { top: '15%', left: '10%', delay: '0s', size: 2 },
            { top: '25%', left: '35%', delay: '1s', size: 1.5 },
            { top: '12%', left: '55%', delay: '2s', size: 2 },
            { top: '30%', left: '75%', delay: '0.5s', size: 1 },
            { top: '18%', left: '90%', delay: '1.5s', size: 1.5 },
            { top: '8%', left: '45%', delay: '3s', size: 1 },
          ].map((star, i) => (
            <div key={i} className="absolute rounded-full bg-white" style={{
              width: star.size, height: star.size,
              top: star.top, left: star.left,
              animation: `starTwinkle 3s ease-in-out ${star.delay} infinite`,
            }} />
          ))}

          {/* Branding text */}
          <div className="absolute top-5 right-6 flex items-center gap-2 opacity-40">
            <div className="w-6 h-6 bg-brand-accent/30 rounded-lg flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-2-2.2-3.3C13 5.6 12 5 11 5H6c-.6 0-1.1.2-1.4.6L3 7.5C2.4 8.1 2 8.8 2 9.5V16c0 .6.4 1 1 1h1" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <span className="text-white/70 text-xs font-display font-bold tracking-wider">KINDLIFT</span>
          </div>

          {/* Tagline */}
          <div className="absolute bottom-8 left-6">
            <p className="text-white/20 text-[10px] font-display font-bold uppercase tracking-[0.25em]">
              Your ride, your community
            </p>
          </div>

          {/* Inline banner animations */}
          <style>{`
            @keyframes bannerOrb1 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(30px, 10px) scale(1.1); }
            }
            @keyframes bannerOrb2 {
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
        <div className="px-8 pb-8 -mt-14">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative group flex flex-col items-center">
              <div className="h-28 w-28 rounded-3xl bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center cursor-pointer"
                onClick={() => photoInputRef.current?.click()}>
                {(formData.profilePhoto || user?.profilePhoto || user?.photo) ? (
                  <img src={formData.profilePhoto || user?.profilePhoto || user?.photo} alt={user?.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-brand-accent/10 flex items-center justify-center">
                    <User className="h-12 w-12 text-brand-accent" />
                  </div>
                )}
              </div>
              {/* Always-visible camera overlay on hover */}
              <label
                className="absolute top-0 left-1/2 -translate-x-1/2 h-28 w-28 rounded-3xl bg-black/40 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={() => photoInputRef.current?.click()}
              >
                <Camera className="h-6 w-6 text-white mb-1" />
                <span className="text-white text-[10px] font-display font-bold">Change</span>
              </label>
              <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              {/* Change Photo text below avatar */}
              <button
                onClick={() => photoInputRef.current?.click()}
                className="mt-2 text-xs text-brand-accent font-display font-bold hover:underline transition-all flex items-center gap-1"
              >
                <Camera className="h-3 w-3" /> Change Photo
              </button>
            </div>

            <div className="flex-1 pt-16 sm:pt-4">
              <div className="flex items-start justify-between">
                <div>
                  {editing ? (
                    <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="font-display text-2xl font-bold text-brand-dark bg-transparent border-b-2 border-brand-accent outline-none pb-1" />
                  ) : (
                    <h1 className="font-display text-2xl font-bold text-brand-dark">{user?.name}</h1>
                  )}
                  <p className="text-brand-muted text-sm mt-1 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {editing ? (
                      <div className="flex items-center gap-1 text-sm text-brand-muted">
                        <Phone className="h-3.5 w-3.5" />
                        <input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number"
                          className="bg-transparent border-b border-brand-gray-light outline-none text-brand-dark text-sm" />
                      </div>
                    ) : user?.phone && (
                      <p className="text-brand-muted text-sm flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {user.phone}</p>
                    )}
                  </div>
                </div>
                <div>
                  {editing ? (
                    <div className="flex gap-2">
                      <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-1 px-4 py-2 bg-brand-dark text-white rounded-full text-sm font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all">
                        <Save className="h-3.5 w-3.5" /> {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => setEditing(false)} className="p-2 rounded-full hover:bg-brand-dark/5"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <button onClick={() => setEditing(true)}
                      className="flex items-center gap-1 px-4 py-2 bg-brand-dark/5 rounded-full text-sm font-display font-bold text-brand-dark hover:bg-brand-dark/10 transition-all">
                      <Edit3 className="h-3.5 w-3.5" /> Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {user?.isDriverVerified && <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-bold flex items-center gap-1"><Car className="h-3 w-3" /> Verified Driver</span>}
                {user?.isAdmin && <span className="px-3 py-1 text-xs rounded-full bg-violet-100 text-violet-700 font-bold flex items-center gap-1"><Shield className="h-3 w-3" /> Admin</span>}
                <span className="px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-700 font-bold flex items-center gap-1"><Coins className="h-3 w-3" /> {user?.coins || 0} Coins</span>
                <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1"><Star className="h-3 w-3" /> {avgRating} Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Rides Offered', value: stats.ridesOffered, icon: Car, color: 'bg-blue-500' },
          { label: 'Rides Completed', value: stats.ridesCompleted, icon: CheckCircle, color: 'bg-emerald-500' },
          { label: 'Bookings Made', value: stats.requestsMade, icon: TrendingUp, color: 'bg-violet-500' },
          { label: 'Bookings Done', value: stats.requestsCompleted, icon: Award, color: 'bg-amber-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-brand-gray-light p-5 card-lift">
            <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-display font-black text-brand-dark">{s.value}</p>
            <p className="text-xs text-brand-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Ratings Section */}
      <div className="bg-white rounded-2xl border border-brand-gray-light p-6">
        <h2 className="font-display font-bold text-lg text-brand-dark mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-brand-accent" /> My Ratings ({ratings.length})
        </h2>
        {loading ? (
          <div className="flex justify-center py-8"><div className="loader-spinner" /></div>
        ) : ratings.length === 0 ? (
          <p className="text-brand-muted text-center py-8">No ratings received yet</p>
        ) : (
          <div className="space-y-3">
            {ratings.map(r => (
              <div key={r._id} className="bg-brand-dark/[0.02] rounded-xl p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-sm flex-shrink-0 overflow-hidden">
                  {r.raterId?.profilePhoto ? <img src={r.raterId.profilePhoto} alt="" className="h-full w-full object-cover" /> : r.raterId?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-brand-dark">{r.raterId?.name || 'Anonymous'}</span>
                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />)}</div>
                  </div>
                  <p className="text-sm text-brand-muted">{r.review || 'No written review'}</p>
                  <p className="text-xs text-brand-muted/60 mt-1">{format(new Date(r.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
