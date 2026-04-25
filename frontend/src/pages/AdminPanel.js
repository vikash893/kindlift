import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import {
  LayoutDashboard, Users, Car, MessageSquare, Star, Shield, Search,
  ChevronLeft, ChevronRight, Trash2, UserCheck, UserX, Eye, X,
  TrendingUp, Activity, Award, MapPin, Clock, CheckCircle, XCircle,
  BarChart3, Coins, AlertTriangle, User as UserIcon, ArrowUpRight, RefreshCw,
  ShieldAlert, FileText, Image, Menu,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAlert } from '../components/CustomAlert';

// ─── ADMIN DASHBOARD TAB ────────────────────────────
const DashboardTab = ({ stats, loading }) => {
  if (loading) return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-brand-gray-light p-5 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-gray-200" />
              <div className="h-3 w-16 bg-gray-100 rounded-full" />
            </div>
            <div className="h-7 w-20 bg-gray-200 rounded-full mb-2" />
            <div className="h-3 w-24 bg-gray-100 rounded-full" />
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-brand-gray-light p-6 animate-pulse space-y-4">
            <div className="h-5 w-36 bg-gray-200 rounded-full" />
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded-full w-2/3" />
                  <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
  if (!stats) return <EmptyState icon={BarChart3} text="No data available" />;
  const o = stats.overview;

  const cards = [
    { label: 'Total Users', value: o.totalUsers, icon: Users, color: 'bg-blue-500', change: `+${o.newUsersThisWeek} this week` },
    { label: 'Verified Drivers', value: o.verifiedDrivers, icon: UserCheck, color: 'bg-emerald-500' },
    { label: 'Pending Verifications', value: o.pendingVerifications || 0, icon: ShieldAlert, color: 'bg-orange-500' },
    { label: 'Total Rides', value: o.totalRides, icon: Car, color: 'bg-violet-500', change: `+${o.newRidesThisWeek} this week` },
    { label: 'Active Rides', value: o.activeRides, icon: Activity, color: 'bg-amber-500' },
    { label: 'Completed Rides', value: o.completedRides, icon: CheckCircle, color: 'bg-teal-500' },
    { label: 'Pending Requests', value: o.pendingRequests, icon: Clock, color: 'bg-orange-500' },
    { label: 'Total Ratings', value: o.totalRatings, icon: Star, color: 'bg-pink-500' },
    { label: 'Avg Rating', value: o.averageRating, icon: Award, color: 'bg-indigo-500' },
    { label: 'Messages', value: o.totalMessages, icon: MessageSquare, color: 'bg-cyan-500' },
    { label: 'Active Users', value: o.activeUsers, icon: UserCheck, color: 'bg-lime-600' },
    { label: 'Total Requests', value: o.totalRequests, icon: TrendingUp, color: 'bg-rose-500' },
    { label: 'Accepted Requests', value: o.acceptedRequests, icon: CheckCircle, color: 'bg-green-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-brand-gray-light p-5 card-lift">
            <div className="flex items-center justify-between mb-3">
              <div className={`h-10 w-10 rounded-xl ${c.color} flex items-center justify-center`}>
                <c.icon className="h-5 w-5 text-white" />
              </div>
              {c.change && <span className="text-xs text-emerald-600 font-semibold">{c.change}</span>}
            </div>
            <p className="text-2xl font-display font-black text-brand-dark">{c.value}</p>
            <p className="text-xs text-brand-muted mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-brand-gray-light p-6">
          <h3 className="font-display font-bold text-brand-dark mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-accent" /> Recent Sign-ups
          </h3>
          <div className="space-y-3">
            {stats.recentUsers?.map(u => (
              <div key={u._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-brand-dark/5 transition-colors">
                <div className="h-9 w-9 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-sm overflow-hidden">
                  {u.profilePhoto ? <img src={u.profilePhoto} alt="" className="h-full w-full object-cover" /> : u.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-dark truncate">{u.name}</p>
                  <p className="text-xs text-brand-muted truncate">{u.email}</p>
                </div>
                <span className="text-xs text-brand-muted">{format(new Date(u.createdAt), 'MMM d')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated Users */}
        <div className="bg-white rounded-2xl border border-brand-gray-light p-6">
          <h3 className="font-display font-bold text-brand-dark mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-brand-accent" /> Top Rated Users
          </h3>
          <div className="space-y-3">
            {stats.topUsers?.map((u, i) => (
              <div key={u._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-brand-dark/5 transition-colors">
                <div className="h-8 w-8 rounded-full bg-brand-dark flex items-center justify-center text-white font-bold text-xs">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-dark truncate">{u.name}</p>
                  <div className="flex items-center gap-2 text-xs text-brand-muted">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400 fill-amber-400" />{(u.ratingSum / u.totalRatings).toFixed(1)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Coins className="h-3 w-3" />{u.coins}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="bg-white rounded-2xl border border-brand-gray-light p-6">
        <h3 className="font-display font-bold text-brand-dark mb-4 flex items-center gap-2">
          <Car className="h-4 w-4 text-brand-accent" /> Recent Rides
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-brand-gray-light">
              <th className="text-left py-3 px-2 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Driver</th>
              <th className="text-left py-3 px-2 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Route</th>
              <th className="text-left py-3 px-2 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-2 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Date</th>
            </tr></thead>
            <tbody>
              {stats.recentRides?.map(r => (
                <tr key={r._id} className="border-b border-brand-gray-light/50 hover:bg-brand-dark/[0.02]">
                  <td className="py-3 px-2 font-medium">{r.driverId?.name || 'Unknown'}</td>
                  <td className="py-3 px-2 text-brand-muted">{r.source?.name?.substring(0, 20)}... → {r.destination?.name?.substring(0, 20)}...</td>
                  <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
                  <td className="py-3 px-2 text-brand-muted">{format(new Date(r.createdAt), 'MMM d, h:mm a')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── USERS TAB ──────────────────────────────────────
const UsersTab = ({ onViewUser }) => {
  const { toast, confirm: confirmAlert } = useAlert();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?page=${page}&search=${search}&filter=${filter}&limit=15`);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleActive = async (id, current) => {
    try {
      await api.put(`/admin/users/${id}`, { isActive: !current });
      toast('success', `User ${current ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (err) { toast('error', 'Failed to update user'); }
  };

  const handleDelete = async (id, name) => {
    const confirmed = await confirmAlert(`Delete user "${name}" and all their data? This cannot be undone.`, 'Delete User');
    if (!confirmed) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast('success', `User "${name}" deleted successfully`);
      fetchUsers();
    } catch (err) { toast('error', 'Failed to delete user'); }
  };

  const handleMakeAdmin = async (id) => {
    try {
      await api.put(`/admin/users/${id}`, { isAdmin: true, role: 'admin' });
      toast('success', 'User promoted to admin');
      fetchUsers();
    } catch (err) { toast('error', 'Failed to update user role'); }
  };

  const filters = ['all', 'drivers', 'admins', 'inactive'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
          <input
            type="text" placeholder="Search by name or email..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-brand-gray-light text-sm focus:border-brand-accent focus:ring-0 outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {filters.map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }}
              className={`px-4 py-2 text-xs font-display font-bold rounded-full capitalize transition-all ${filter === f ? 'bg-brand-dark text-white' : 'bg-white text-brand-muted border border-brand-gray-light hover:border-brand-dark'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : users.length === 0 ? <EmptyState icon={Users} text="No users found" /> : (
        <div className="bg-white rounded-2xl border border-brand-gray-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-brand-dark/[0.02] border-b border-brand-gray-light">
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">User</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Role</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider hidden md:table-cell">Coins</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Actions</th>
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-brand-gray-light/50 hover:bg-brand-dark/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-sm flex-shrink-0 overflow-hidden">
                          {u.profilePhoto ? <img src={u.profilePhoto} alt="" className="h-full w-full object-cover" /> : u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-brand-dark truncate">{u.name}</p>
                          <p className="text-xs text-brand-muted md:hidden truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-brand-muted hidden md:table-cell">{u.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {u.isAdmin && <span className="px-2 py-0.5 text-xs rounded-full bg-violet-100 text-violet-700 font-bold">Admin</span>}
                        {u.isDriverVerified && <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-bold">Driver</span>}
                        {!u.isAdmin && !u.isDriverVerified && <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 font-bold">User</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell"><span className="flex items-center gap-1 text-brand-muted"><Coins className="h-3.5 w-3.5 text-amber-500" />{u.coins || 0}</span></td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${u.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => onViewUser(u._id)} title="View Details" className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleToggleActive(u._id, u.isActive !== false)} title={u.isActive !== false ? 'Deactivate' : 'Activate'} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors">
                          {u.isActive !== false ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        {!u.isAdmin && <button onClick={() => handleMakeAdmin(u._id)} title="Make Admin" className="p-1.5 rounded-lg hover:bg-violet-50 text-violet-600 transition-colors"><Shield className="h-4 w-4" /></button>}
                        <button onClick={() => handleDelete(u._id, u.name)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} page={page} setPage={setPage} />
        </div>
      )}
    </div>
  );
};

// ─── USER DETAIL MODAL ──────────────────────────────
const UserDetailModal = ({ userId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      api.get(`/admin/users/${userId}`).then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
    }
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display font-bold text-lg text-brand-dark">User Details</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-dark/5"><X className="h-5 w-5" /></button>
        </div>
        {loading ? <LoadingSpinner /> : data && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-2xl overflow-hidden">
                {data.user.profilePhoto ? <img src={data.user.profilePhoto} alt="" className="h-full w-full object-cover" /> : data.user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h4 className="font-display font-bold text-brand-dark text-lg">{data.user.name}</h4>
                <p className="text-sm text-brand-muted">{data.user.email}</p>
                {data.user.phone && <p className="text-sm text-brand-muted">{data.user.phone}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Rides Offered', value: data.stats.ridesOffered },
                { label: 'Rides Completed', value: data.stats.ridesCompleted },
                { label: 'Requests Made', value: data.stats.requestsMade },
                { label: 'Requests Completed', value: data.stats.requestsCompleted },
                { label: 'Coins', value: data.user.coins || 0 },
                { label: 'Ratings Given', value: data.stats.ratingsGiven },
              ].map((s, i) => (
                <div key={i} className="bg-brand-dark/[0.03] rounded-xl p-3 text-center">
                  <p className="text-xl font-display font-black text-brand-dark">{s.value}</p>
                  <p className="text-xs text-brand-muted">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`px-3 py-1 rounded-full font-bold ${data.user.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{data.user.isActive !== false ? 'Active' : 'Inactive'}</span>
              {data.user.isAdmin && <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 font-bold">Admin</span>}
              {data.user.isDriverVerified && <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">Verified Driver</span>}
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-bold">Joined {format(new Date(data.user.createdAt), 'MMM d, yyyy')}</span>
            </div>
            {data.stats.ratingsReceived?.length > 0 && (
              <div>
                <h5 className="font-display font-bold text-sm text-brand-dark mb-3">Recent Ratings Received</h5>
                <div className="space-y-2">
                  {data.stats.ratingsReceived.map(r => (
                    <div key={r._id} className="bg-brand-dark/[0.02] rounded-xl p-3 flex items-start gap-3">
                      <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-brand-muted truncate">{r.review || 'No review'}</p>
                        <p className="text-xs text-brand-muted/60 mt-1">by {r.raterId?.name || 'Unknown'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── RIDES TAB ──────────────────────────────────────
const RidesTab = () => {
  const { toast, confirm: confirmAlert } = useAlert();
  const [rides, setRides] = useState([]);
  const [pagination, setPagination] = useState({});
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchRides = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/rides?page=${page}&status=${status}&limit=15`);
      setRides(res.data.rides);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, status]);

  useEffect(() => { fetchRides(); }, [fetchRides]);

  const handleStatusChange = async (id, newStatus) => {
    try { await api.put(`/admin/rides/${id}`, { status: newStatus }); toast('success', 'Ride status updated'); fetchRides(); }
    catch (err) { toast('error', 'Failed to update ride'); }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAlert('Delete this ride and all related requests?', 'Delete Ride');
    if (!confirmed) return;
    try { await api.delete(`/admin/rides/${id}`); toast('success', 'Ride deleted successfully'); fetchRides(); }
    catch (err) { toast('error', 'Failed to delete ride'); }
  };

  const statuses = ['', 'waiting', 'ongoing', 'completed', 'cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 text-xs font-display font-bold rounded-full capitalize transition-all ${status === s ? 'bg-brand-dark text-white' : 'bg-white text-brand-muted border border-brand-gray-light hover:border-brand-dark'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : rides.length === 0 ? <EmptyState icon={Car} text="No rides found" /> : (
        <div className="bg-white rounded-2xl border border-brand-gray-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-brand-dark/[0.02] border-b border-brand-gray-light">
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Driver</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Route</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider hidden md:table-cell">Seats</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Actions</th>
              </tr></thead>
              <tbody>
                {rides.map(r => (
                  <tr key={r._id} className="border-b border-brand-gray-light/50 hover:bg-brand-dark/[0.02] transition-colors">
                    <td className="py-3 px-4 font-medium">{r.driverId?.name || 'Unknown'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2 text-xs">
                        <div>
                          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent" /><span className="text-brand-dark truncate max-w-[120px] inline-block">{r.source?.name}</span></div>
                          <div className="flex items-center gap-1 mt-1"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /><span className="text-brand-muted truncate max-w-[120px] inline-block">{r.destination?.name}</span></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">{r.seatsAvailable}</td>
                    <td className="py-3 px-4"><StatusBadge status={r.status} /></td>
                    <td className="py-3 px-4 text-brand-muted hidden md:table-cell">{format(new Date(r.createdAt), 'MMM d')}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <select value={r.status} onChange={e => handleStatusChange(r._id, e.target.value)}
                          className="text-xs bg-transparent border border-brand-gray-light rounded-lg px-2 py-1 outline-none focus:border-brand-accent">
                          {['waiting', 'ongoing', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => handleDelete(r._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} page={page} setPage={setPage} />
        </div>
      )}
    </div>
  );
};

// ─── RATINGS TAB (with AI Sentiment) ────────────────
const RatingsTab = () => {
  const { toast, confirm: confirmAlert } = useAlert();
  const [ratings, setRatings] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sentiments, setSentiments] = useState({});
  const [analyzingAll, setAnalyzingAll] = useState(false);

  const fetchRatings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/ratings?page=${page}&limit=15`);
      setRatings(res.data.ratings);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchRatings(); }, [fetchRatings]);

  const analyzeSentiment = async (ratingId, reviewText) => {
    if (!reviewText?.trim()) return;
    setSentiments(prev => ({ ...prev, [ratingId]: { loading: true } }));
    try {
      const res = await api.post('/ratings/predict-sentiment', { review: reviewText });
      setSentiments(prev => ({ ...prev, [ratingId]: res.data }));
    } catch {
      setSentiments(prev => ({ ...prev, [ratingId]: { error: true } }));
    }
  };

  const analyzeAll = async () => {
    setAnalyzingAll(true);
    const reviewRatings = ratings.filter(r => r.review?.trim());
    for (const r of reviewRatings) {
      if (!sentiments[r._id] || sentiments[r._id].error) {
        await analyzeSentiment(r._id, r.review);
      }
    }
    setAnalyzingAll(false);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAlert('Delete this rating? User aggregate will be updated.', 'Delete Rating');
    if (!confirmed) return;
    try { await api.delete(`/admin/ratings/${id}`); toast('success', 'Rating deleted'); fetchRatings(); }
    catch (err) { toast('error', 'Failed to delete rating'); }
  };

  const getSentimentBadge = (s) => {
    if (!s) return null;
    if (s.loading) return <span className="px-2 py-0.5 text-[10px] rounded-full bg-gray-100 text-gray-500 font-bold animate-pulse">Analyzing...</span>;
    if (s.error) return <span className="px-2 py-0.5 text-[10px] rounded-full bg-red-50 text-red-400 font-bold">ML Error</span>;
    const colors = {
      positive: 'bg-emerald-100 text-emerald-800',
      negative: 'bg-red-100 text-red-800',
      neutral: 'bg-amber-100 text-amber-800',
    };
    return (
      <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${colors[s.predicted_sentiment] || 'bg-gray-100 text-gray-600'}`}>
        {s.predicted_sentiment} · {s.confidence} ({Math.round(s.confidence_score * 100)}%)
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-indigo-900 text-sm">AI Sentiment Analysis</p>
            <p className="text-xs text-indigo-600">Analyze review sentiments using the ML model</p>
          </div>
        </div>
        <button onClick={analyzeAll} disabled={analyzingAll || loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full text-xs font-display font-bold hover:bg-indigo-700 transition-all disabled:opacity-50">
          <Activity className={`h-3.5 w-3.5 ${analyzingAll ? 'animate-spin' : ''}`} />
          {analyzingAll ? 'Analyzing...' : 'Analyze All Reviews'}
        </button>
      </div>

      {loading ? <LoadingSpinner /> : ratings.length === 0 ? <EmptyState icon={Star} text="No ratings yet" /> : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ratings.map(r => (
              <div key={r._id} className="bg-white rounded-2xl border border-brand-gray-light p-5 card-lift">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />)}</div>
                  <button onClick={() => handleDelete(r._id)} className="p-1 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <p className="text-sm text-brand-dark mb-3">{r.review || <span className="text-brand-muted italic">No review text</span>}</p>

                {/* AI Sentiment Badge */}
                {r.review?.trim() && (
                  <div className="mb-3 flex items-center gap-2">
                    {sentiments[r._id] ? getSentimentBadge(sentiments[r._id]) : (
                      <button onClick={() => analyzeSentiment(r._id, r.review)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-display font-bold text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors">
                        <TrendingUp className="h-3 w-3" /> Analyze
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-brand-gray-light">
                  <div className="text-xs"><span className="text-brand-muted">By:</span> <span className="font-semibold text-brand-dark">{r.raterId?.name || 'Unknown'}</span></div>
                  <div className="text-xs"><span className="text-brand-muted">For:</span> <span className="font-semibold text-brand-dark">{r.ratedUserId?.name || 'Unknown'}</span></div>
                </div>
                <p className="text-xs text-brand-muted mt-2">{format(new Date(r.createdAt), 'MMM d, yyyy · h:mm a')} · <span className="capitalize">{r.raterRole}</span></p>
              </div>
            ))}
          </div>
          <Pagination pagination={pagination} page={page} setPage={setPage} />
        </>
      )}
    </div>
  );
};

// ─── REQUESTS TAB ───────────────────────────────────
const RequestsTab = () => {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({});
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/requests?page=${page}&status=${status}&limit=15`);
      setRequests(res.data.requests);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, status]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const statuses = ['', 'pending', 'accepted', 'rejected', 'completed'];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 text-xs font-display font-bold rounded-full capitalize transition-all ${status === s ? 'bg-brand-dark text-white' : 'bg-white text-brand-muted border border-brand-gray-light hover:border-brand-dark'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : requests.length === 0 ? <EmptyState icon={MessageSquare} text="No requests found" /> : (
        <div className="bg-white rounded-2xl border border-brand-gray-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-brand-dark/[0.02] border-b border-brand-gray-light">
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Passenger</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider hidden md:table-cell">Driver</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Route</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
              </tr></thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r._id} className="border-b border-brand-gray-light/50 hover:bg-brand-dark/[0.02] transition-colors">
                    <td className="py-3 px-4 font-medium">{r.passengerId?.name || 'Unknown'}</td>
                    <td className="py-3 px-4 text-brand-muted hidden md:table-cell">{r.offerId?.driverId?.name || 'Unknown'}</td>
                    <td className="py-3 px-4 text-xs text-brand-muted">{r.source?.name?.substring(0, 18)}... → {r.destination?.name?.substring(0, 18)}...</td>
                    <td className="py-3 px-4"><StatusBadge status={r.status} /></td>
                    <td className="py-3 px-4 text-brand-muted hidden md:table-cell">{format(new Date(r.createdAt), 'MMM d')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} page={page} setPage={setPage} />
        </div>
      )}
    </div>
  );
};

// ─── VERIFICATIONS TAB ──────────────────────────────
const VerificationsTab = () => {
  const { toast } = useAlert();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewDoc, setViewDoc] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/verifications?page=${page}&status=${statusFilter}&limit=15`);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchVerifications(); }, [fetchVerifications]);

  const handleVerification = async (userId, status) => {
    setActionLoading(userId);
    try {
      await api.put(`/admin/verifications/${userId}`, { status, note: noteText || undefined });
      toast('success', `Driver ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      setNoteText('');
      fetchVerifications();
    } catch (err) { toast('error', 'Failed to update verification'); }
    finally { setActionLoading(null); }
  };

  const statuses = ['pending', 'approved', 'rejected', 'all'];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 text-xs font-display font-bold rounded-full capitalize transition-all ${statusFilter === s ? 'bg-brand-dark text-white' : 'bg-white text-brand-muted border border-brand-gray-light hover:border-brand-dark'}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : users.length === 0 ? <EmptyState icon={ShieldAlert} text={`No ${statusFilter} verifications`} /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {users.map(u => (
            <div key={u._id} className="bg-white rounded-2xl border border-brand-gray-light p-5 card-lift">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-lg overflow-hidden flex-shrink-0">
                  {u.profilePhoto ? <img src={u.profilePhoto} alt="" className="h-full w-full object-cover" /> : u.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-brand-dark truncate">{u.name}</p>
                  <p className="text-xs text-brand-muted truncate">{u.email}</p>
                  <div className="mt-1">
                    <StatusBadge status={u.driverVerificationStatus} />
                  </div>
                </div>
              </div>

              {/* Document Details */}
              <div className="bg-brand-dark/[0.02] rounded-xl p-3 mb-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-muted font-semibold">Vehicle Number</span>
                  <span className="font-mono font-bold text-brand-dark">{u.vehicleNumber || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-muted font-semibold">License Number</span>
                  <span className="font-mono font-bold text-brand-dark">{u.licenseNumber || 'N/A'}</span>
                </div>
                {u.vehiclePhoto && (
                  <div>
                    <button onClick={() => setViewDoc(u.vehiclePhoto)}
                      className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold mt-1">
                      <Image className="h-3.5 w-3.5" /> View Vehicle Photo
                    </button>
                  </div>
                )}
              </div>

              {u.driverVerificationNote && (
                <div className="bg-amber-50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-amber-800 font-semibold">Admin Note:</p>
                  <p className="text-xs text-amber-700 mt-1">{u.driverVerificationNote}</p>
                </div>
              )}

              {/* Actions */}
              {u.driverVerificationStatus === 'pending' && (
                <div className="space-y-3">
                  <input type="text" placeholder="Optional note for driver..."
                    value={actionLoading === u._id ? noteText : ''}
                    onChange={(e) => { setNoteText(e.target.value); setActionLoading(u._id); }}
                    className="w-full px-3 py-2 bg-brand-dark/[0.03] rounded-lg border-0 text-xs outline-none focus:ring-1 focus:ring-brand-accent"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleVerification(u._id, 'approved')}
                      disabled={actionLoading === u._id && actionLoading !== u._id}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-display font-bold hover:bg-emerald-600 transition-all">
                      <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button onClick={() => handleVerification(u._id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-500 text-white rounded-xl text-xs font-display font-bold hover:bg-red-600 transition-all">
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Pagination pagination={pagination} page={page} setPage={setPage} />

      {/* Document Viewer Modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewDoc(null)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-brand-dark">Vehicle Photo</h3>
              <button onClick={() => setViewDoc(null)} className="p-2 rounded-full hover:bg-brand-dark/5"><X className="h-5 w-5" /></button>
            </div>
            <img src={viewDoc} alt="Vehicle" className="w-full rounded-2xl object-contain max-h-[60vh]" />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SHARED COMPONENTS ──────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    waiting: 'bg-amber-100 text-amber-700', ongoing: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700', accepted: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700', approved: 'bg-emerald-100 text-emerald-700',
    none: 'bg-gray-100 text-gray-500',
  };
  return <span className={`px-2.5 py-0.5 text-xs rounded-full font-bold capitalize ${styles[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

const LoadingSpinner = () => (
  <div className="space-y-4 py-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
    ))}
  </div>
);

const EmptyState = ({ icon: Icon, text }) => (
  <div className="bg-white rounded-2xl border border-brand-gray-light p-16 text-center">
    <Icon className="h-10 w-10 mx-auto text-brand-muted/30 mb-4" />
    <p className="text-brand-muted">{text}</p>
  </div>
);

const Pagination = ({ pagination, page, setPage }) => {
  if (!pagination || pagination.total <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-brand-gray-light bg-brand-dark/[0.01]">
      <p className="text-xs text-brand-muted">Page {pagination.current} of {pagination.total} · {pagination.count} total</p>
      <div className="flex gap-1">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
          className="p-1.5 rounded-lg hover:bg-brand-dark/5 disabled:opacity-30 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
        <button onClick={() => setPage(p => Math.min(pagination.total, p + 1))} disabled={page >= pagination.total}
          className="p-1.5 rounded-lg hover:bg-brand-dark/5 disabled:opacity-30 transition-colors"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
};

// ─── SKELETON LOADERS ───────────────────────────────
const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-brand-gray-light p-5 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-10 w-10 rounded-xl bg-gray-200" />
      <div className="h-3 w-16 bg-gray-200 rounded-full" />
    </div>
    <div className="h-7 w-20 bg-gray-200 rounded-full mb-2" />
    <div className="h-3 w-24 bg-gray-100 rounded-full" />
  </div>
);

const TableRowSkeleton = ({ cols = 5 }) => (
  <tr className="border-b border-brand-gray-light/50">
    {[...Array(cols)].map((_, i) => (
      <td key={i} className="py-3 px-4">
        <div className="h-3 bg-gray-100 rounded-full animate-pulse" style={{ width: `${50 + Math.random() * 40}%` }} />
      </td>
    ))}
  </tr>
);

// ─── FEEDBACK TAB ───────────────────────────────────
const FeedbackTab = () => {
  const { toast, confirm: confirmAlert } = useAlert();
  const [feedbacks, setFeedbacks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/feedback?page=${page}&limit=15`);
      setFeedbacks(res.data.feedbacks);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const handleToggleFeature = async (id, currentStatus) => {
    try {
      await api.put(`/admin/feedback/${id}/feature`, { isFeatured: !currentStatus });
      toast('success', `Feedback ${!currentStatus ? 'featured on Home page' : 'removed from Home page'}`);
      fetchFeedback();
    } catch (err) { toast('error', 'Failed to update feedback'); }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAlert('Delete this feedback?', 'Delete Feedback');
    if (!confirmed) return;
    try { 
      await api.delete(`/admin/feedback/${id}`); 
      toast('success', 'Feedback deleted'); 
      fetchFeedback(); 
    } catch (err) { toast('error', 'Failed to delete feedback'); }
  };

  return (
    <div className="space-y-6">
      {loading ? <LoadingSpinner /> : feedbacks.length === 0 ? <EmptyState icon={MessageSquare} text="No feedback found" /> : (
        <div className="bg-white rounded-2xl border border-brand-gray-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-brand-dark/[0.02] border-b border-brand-gray-light">
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">User</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Feedback Message</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-4 font-display font-bold text-brand-muted text-xs uppercase tracking-wider">Actions</th>
              </tr></thead>
              <tbody>
                {feedbacks.map(f => (
                  <tr key={f._id} className="border-b border-brand-gray-light/50 hover:bg-brand-dark/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-dark truncate">{f.name}</p>
                        <p className="text-xs text-brand-muted truncate">{f.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-brand-dark text-sm max-w-xs md:max-w-md break-words">{f.message}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${f.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                        {f.isFeatured ? 'Featured' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleToggleFeature(f._id, f.isFeatured)} title={f.isFeatured ? 'Remove from Home' : 'Add to Home'} className={`p-1.5 rounded-lg transition-colors ${f.isFeatured ? 'bg-amber-50 text-amber-600' : 'hover:bg-amber-50 text-gray-400 hover:text-amber-600'}`}>
                          <Star className={`h-4 w-4 ${f.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                        <button onClick={() => handleDelete(f._id)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} page={page} setPage={setPage} />
        </div>
      )}
    </div>
  );
};

// ═══════════════════ MAIN ADMIN PANEL ═══════════════════
export const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [viewUserId, setViewUserId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user?.isAdmin && user?.role !== 'admin' && user?.role !== 'superadmin') {
      navigate('/dashboard');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) { console.error('Failed to load admin stats:', err); }
    finally { setStatsLoading(false); }
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Platform overview & analytics' },
    { key: 'users', label: 'Users', icon: Users, description: 'Manage all registered users' },
    { key: 'rides', label: 'Rides', icon: Car, description: 'Manage ride offers' },
    { key: 'requests', label: 'Requests', icon: MessageSquare, description: 'Manage ride requests' },
    { key: 'ratings', label: 'Ratings', icon: Star, description: 'Review & AI sentiment analysis' },
    { key: 'verifications', label: 'Verifications', icon: ShieldAlert, description: 'Driver verification queue', badge: stats?.overview?.pendingVerifications },
    { key: 'feedback', label: 'Feedback', icon: FileText, description: 'Manage user feedback' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── Sidebar ─────────────────────────────────────── */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-[160] w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-brand-dark">Admin Panel</p>
              <p className="text-xs text-brand-muted capitalize">{user?.role || 'admin'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-brand-dark to-brand-dark/90 text-white shadow-lg'
                  : 'text-brand-muted hover:bg-brand-dark/5 hover:text-brand-dark'
              }`}
            >
              <tab.icon className={`h-4 w-4 flex-shrink-0 ${activeTab === tab.key ? 'text-brand-accent' : ''}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-bold truncate">{tab.label}</p>
                <p className={`text-[10px] truncate ${activeTab === tab.key ? 'text-white/60' : 'text-brand-muted/60'}`}>{tab.description}</p>
              </div>
              {tab.badge > 0 && (
                <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-orange-500 text-white text-[9px] font-bold rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={fetchStats}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-dark/5 hover:bg-brand-dark/10 text-brand-dark text-xs font-display font-bold rounded-xl transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-brand-muted hover:text-brand-dark text-xs font-medium rounded-xl transition-all hover:bg-brand-dark/5"
          >
            ← Back to Dashboard
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-brand-dark/5 text-brand-dark"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg text-brand-dark">
                {tabs.find(t => t.key === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-brand-muted hidden sm:block">
                {tabs.find(t => t.key === activeTab)?.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {stats && (
              <div className="hidden lg:flex items-center gap-3 bg-brand-dark/5 rounded-full px-4 py-2 text-xs">
                <span className="font-bold text-brand-dark">{stats.overview?.totalUsers} users</span>
                <span className="h-3 w-px bg-brand-dark/20" />
                <span className="font-bold text-brand-dark">{stats.overview?.activeRides} active rides</span>
                {stats.overview?.pendingVerifications > 0 && (
                  <>
                    <span className="h-3 w-px bg-brand-dark/20" />
                    <span className="font-bold text-orange-600">{stats.overview.pendingVerifications} pending</span>
                  </>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                {user?.profilePhoto
                  ? <img src={user.profilePhoto} alt="" className="h-full w-full object-cover" />
                  : user?.name?.charAt(0)?.toUpperCase()
                }
              </div>
              <span className="text-sm font-medium text-brand-dark hidden sm:block">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-8">
          {activeTab === 'dashboard' && <DashboardTab stats={stats} loading={statsLoading} />}
          {activeTab === 'users' && <UsersTab onViewUser={setViewUserId} />}
          {activeTab === 'rides' && <RidesTab />}
          {activeTab === 'requests' && <RequestsTab />}
          {activeTab === 'ratings' && <RatingsTab />}
          {activeTab === 'verifications' && <VerificationsTab />}
          {activeTab === 'feedback' && <FeedbackTab />}
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal userId={viewUserId} onClose={() => setViewUserId(null)} />
    </div>
  );
};
