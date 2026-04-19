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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast('warning', 'Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setFormData(p => ({ ...p, profilePhoto: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.get('/auth/me');
      // Update via auth context (profile photo is stored on user model)
      updateUser({ name: formData.name, phone: formData.phone, profilePhoto: formData.profilePhoto });
      setEditing(false);
      showSuccess('Profile updated! Changes will reflect on next login.', 'Profile Saved');
    } catch (err) { toast('error', 'Failed to save profile'); }
    finally { setSaving(false); }
  };

  const avgRating = user?.totalRatings > 0 ? (user.ratingSum / user.totalRatings).toFixed(1) : 'N/A';

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 pt-28">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-brand-gray-light overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-brand-dark via-brand-charcoal to-brand-dark relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(232,168,56,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(232,168,56,0.2) 0%, transparent 50%)' }} />
        </div>
        <div className="px-8 pb-8 -mt-14">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative group">
              <div className="h-28 w-28 rounded-3xl bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                {(editing ? formData.profilePhoto : user?.profilePhoto || user?.photo) ? (
                  <img src={editing ? formData.profilePhoto : user?.profilePhoto} alt={user?.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-brand-accent/10 flex items-center justify-center">
                    <User className="h-12 w-12 text-brand-accent" />
                  </div>
                )}
              </div>
              {editing && (
                <label className="absolute inset-0 rounded-3xl bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              )}
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
