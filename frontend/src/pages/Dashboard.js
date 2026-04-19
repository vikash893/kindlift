import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { socket } from '../lib/socket';
import { useAlert } from '../components/CustomAlert';
import { MapPin, Users, Calendar, Clock, CheckCircle, XCircle, User, ArrowRight, Coins } from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useAlert();
  const [activeTab, setActiveTab] = useState('overview');
  const [myOffers, setMyOffers] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [savedRides, setSavedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    socket.on('new_request', (request) => {
      setIncomingRequests((prev) => [request, ...prev]);
    });
    socket.on('request_updated', (request) => {
      setMyRequests((prev) => prev.map((r) => (r._id === request._id ? request : r)));
    });
    return () => {
      socket.off('new_request');
      socket.off('request_updated');
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offersRes, incomingRes, requestsRes, savedRes] = await Promise.all([
        api.get('/rides/my-offers'),
        api.get('/requests/incoming'),
        api.get('/requests/my-requests'),
        api.get('/saved-rides'),
      ]);
      setMyOffers(offersRes.data);
      setIncomingRequests(incomingRes.data);
      setMyRequests(requestsRes.data);
      setSavedRides(savedRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestStatus = async (requestId, status) => {
    try {
      await api.put(`/requests/${requestId}/status`, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating request', error);
      toast('error', 'Failed to update request status');
    }
  };

  const deleteSavedRide = async (id) => {
    try {
      await api.delete(`/saved-rides/${id}`);
      setSavedRides((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error('Error deleting saved ride', error);
    }
  };

  const handleSavedRide = (ride) => {
    navigate('/offer-ride', {
      state: {
        source: ride.source.name,
        destination: ride.destination.name,
        seats: ride.seats,
      },
    });
  };

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'passenger', label: 'My Bookings' },
    { key: 'driver', label: 'My Offers' },
    { key: 'saved', label: 'Saved Rides' },
  ];

  const statusBadge = (status) => {
    const styles = {
      accepted: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
      completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    };
    return styles[status] || styles.pending;
  };

  const avgRating = user?.totalRatings > 0 ? (user.ratingSum / user.totalRatings).toFixed(1) : 'N/A';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="loader-spinner mx-auto mb-4" />
          <p className="text-brand-muted text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 pt-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-8">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl overflow-hidden bg-brand-dark/5 border border-brand-gray-light flex items-center justify-center cursor-pointer" onClick={() => navigate('/profile')}>
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-brand-muted" />
            )}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-dark">
              {myOffers.length === 0 && myRequests.length === 0 ? 'Welcome' : 'Welcome back'}, {user?.name}
            </h1>
            <p className="text-brand-muted text-sm mt-1">
              {myOffers.length === 0 && myRequests.length === 0
                ? 'Get started by offering or booking a ride'
                : 'Manage your rides and bookings'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/offer-ride')} className="px-5 py-2.5 bg-brand-dark text-white rounded-full text-sm font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all duration-500">
            + Offer Ride
          </button>
          <button onClick={() => navigate('/book-ride')} className="px-5 py-2.5 bg-brand-accent text-brand-dark rounded-full text-sm font-display font-bold hover:bg-brand-dark hover:text-white transition-all duration-500">
            Book Ride
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-brand-gray-light p-5 card-lift cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="flex items-center justify-between mb-2">
            <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center"><Coins className="h-4 w-4 text-white" /></div>
            <ArrowRight className="h-4 w-4 text-brand-muted" />
          </div>
          <p className="text-2xl font-display font-black text-brand-dark">{user?.coins || 0}</p>
          <p className="text-xs text-brand-muted mt-0.5">Total Coins</p>
        </div>
        <div className="bg-white rounded-2xl border border-brand-gray-light p-5 card-lift">
          <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center mb-2"><CheckCircle className="h-4 w-4 text-white" /></div>
          <p className="text-2xl font-display font-black text-brand-dark">{avgRating}</p>
          <p className="text-xs text-brand-muted mt-0.5">Avg Rating ({user?.totalRatings || 0} reviews)</p>
        </div>
        <div className="bg-white rounded-2xl border border-brand-gray-light p-5 card-lift">
          <div className="h-9 w-9 rounded-xl bg-blue-500 flex items-center justify-center mb-2"><MapPin className="h-4 w-4 text-white" /></div>
          <p className="text-2xl font-display font-black text-brand-dark">{myOffers.length}</p>
          <p className="text-xs text-brand-muted mt-0.5">Rides Offered</p>
        </div>
        <div className="bg-white rounded-2xl border border-brand-gray-light p-5 card-lift">
          <div className="h-9 w-9 rounded-xl bg-violet-500 flex items-center justify-center mb-2"><Users className="h-4 w-4 text-white" /></div>
          <p className="text-2xl font-display font-black text-brand-dark">{myRequests.length}</p>
          <p className="text-xs text-brand-muted mt-0.5">Ride Bookings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-10 border-b border-brand-gray-light overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 text-sm font-display font-semibold transition-all duration-300 border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-brand-dark border-brand-accent'
                : 'text-brand-muted border-transparent hover:text-brand-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <div onClick={() => navigate('/offer-ride')} className="bg-gradient-to-br from-brand-dark to-brand-charcoal rounded-2xl p-6 text-white cursor-pointer card-lift group">
              <MapPin className="h-8 w-8 mb-4 text-brand-accent" />
              <h3 className="font-display font-bold text-lg mb-1">Offer a Ride</h3>
              <p className="text-white/60 text-sm">Share your commute and earn coins</p>
              <ArrowRight className="h-5 w-5 mt-4 text-brand-accent group-hover:translate-x-2 transition-transform" />
            </div>
            <div onClick={() => navigate('/book-ride')} className="bg-gradient-to-br from-brand-accent to-amber-400 rounded-2xl p-6 text-brand-dark cursor-pointer card-lift group">
              <Users className="h-8 w-8 mb-4" />
              <h3 className="font-display font-bold text-lg mb-1">Book a Ride</h3>
              <p className="text-brand-dark/60 text-sm">Find rides near your route</p>
              <ArrowRight className="h-5 w-5 mt-4 group-hover:translate-x-2 transition-transform" />
            </div>
            <div onClick={() => navigate('/profile')} className="bg-white rounded-2xl border border-brand-gray-light p-6 cursor-pointer card-lift group">
              <User className="h-8 w-8 mb-4 text-brand-accent" />
              <h3 className="font-display font-bold text-lg mb-1 text-brand-dark">My Profile</h3>
              <p className="text-brand-muted text-sm">View ratings, stats & edit profile</p>
              <ArrowRight className="h-5 w-5 mt-4 text-brand-dark group-hover:translate-x-2 transition-transform" />
            </div>
          </div>

          {/* Activity Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-brand-gray-light p-6">
              <h3 className="font-display font-bold text-brand-dark mb-4">Recent Bookings</h3>
              {myRequests.length === 0 ? (
                <p className="text-brand-muted text-sm py-4 text-center">No bookings yet</p>
              ) : (
                <div className="space-y-3">
                  {myRequests.slice(0, 4).map(req => (
                    <div key={req._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-dark/[0.02] transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-brand-dark truncate">{req.source.name} → {req.destination.name}</p>
                        <p className="text-xs text-brand-muted mt-0.5">{req.seatsRequested} seat(s) · {format(new Date(req.createdAt), 'MMM d')}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 text-xs rounded-full font-display font-bold border ${statusBadge(req.status)}`}>{req.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-brand-gray-light p-6">
              <h3 className="font-display font-bold text-brand-dark mb-4">Incoming Requests</h3>
              {incomingRequests.length === 0 ? (
                <p className="text-brand-muted text-sm py-4 text-center">No incoming requests</p>
              ) : (
                <div className="space-y-3">
                  {incomingRequests.slice(0, 4).map(req => (
                    <div key={req._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-dark/[0.02] transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-brand-dark">{req.passengerId?.name} · {req.seatsRequested} seat(s)</p>
                        <p className="text-xs text-brand-muted mt-0.5 truncate">{req.source.name} → {req.destination.name}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 text-xs rounded-full font-display font-bold border ${statusBadge(req.status)}`}>{req.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* PASSENGER TAB */}
      {activeTab === 'passenger' && (
        <div className="space-y-6">
          <h2 className="font-display text-lg font-bold text-brand-dark">My Ride Requests</h2>
          {myRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-brand-gray-light p-16 text-center">
              <Users className="h-10 w-10 mx-auto text-brand-muted/30 mb-4" />
              <p className="text-brand-muted mb-6">You haven't requested any rides yet.</p>
              <button
                onClick={() => navigate('/book-ride')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500"
              >
                Book a Ride <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myRequests.map((req) => (
                <div key={req._id} className="bg-white rounded-2xl border border-brand-gray-light overflow-hidden card-lift">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-5">
                      <span className={`px-3 py-1 text-xs rounded-full font-display font-bold border ${statusBadge(req.status)}`}>
                        {req.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-brand-muted flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(req.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-brand-accent mt-1.5 flex-shrink-0" />
                        <span className="text-brand-dark">{req.source.name}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        <span className="text-brand-dark">{req.destination.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-brand-muted ml-5">
                        <Users className="h-3.5 w-3.5" />
                        {req.seatsRequested} seat(s)
                      </div>
                    </div>

                    {req.status === 'accepted' && req.offerId?.driverId && (
                      <div className="pt-5 border-t border-brand-gray-light space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-brand-dark flex items-center justify-center text-white text-sm font-display font-bold">
                            {req.offerId.driverId.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-display font-bold text-brand-dark">{req.offerId.driverId.name}</p>
                            <p className="text-xs text-brand-muted">{req.offerId.driverId.phone || req.offerId.driverId.email}</p>
                          </div>
                        </div>

                        <div className="bg-brand-dark/5 rounded-xl p-3 text-center">
                          <p className="text-xs font-display font-bold text-brand-muted uppercase tracking-widest mb-1">Your Code</p>
                          <p className="text-2xl font-display font-black text-brand-dark tracking-[0.2em]">{req.completionCode}</p>
                        </div>

                        <button
                          onClick={() => navigate(`/ride/${req._id}`)}
                          className="w-full px-4 py-3 bg-brand-dark text-white rounded-full text-sm font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all duration-500"
                        >
                          View Ride & Chat
                        </button>
                      </div>
                    )}

                    {req.status === 'completed' && (
                      <div className="pt-5 border-t border-brand-gray-light space-y-3">
                        {req.offerId?.driverId && (
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-blue-500 flex items-center justify-center text-white text-sm font-display font-bold">
                              {req.offerId.driverId.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-display font-bold text-brand-dark">{req.offerId.driverId.name}</p>
                              <p className="text-xs text-brand-muted">Ride completed</p>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => navigate(`/ride/${req._id}`)}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-full text-sm font-display font-bold hover:bg-blue-700 transition-all duration-500 flex items-center justify-center gap-2"
                        >
                          {req.isRatedByPassenger ? 'View Details' : '⭐ Rate & Review'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DRIVER TAB */}
      {activeTab === 'driver' && (
        <div className="space-y-8">
          <h2 className="font-display text-lg font-bold text-brand-dark">Incoming Requests</h2>
          {incomingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-brand-gray-light p-16 text-center">
              <Users className="h-10 w-10 mx-auto text-brand-muted/30 mb-4" />
              <p className="text-brand-muted">No incoming requests right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((req) => (
                <div key={req._id} className="bg-white rounded-2xl border border-brand-gray-light p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 card-lift">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-brand-dark flex items-center justify-center text-white font-display font-bold text-sm">
                        {req.passengerId?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <span className="font-display font-bold text-brand-dark text-sm">{req.passengerId?.name}</span>
                        <p className="text-xs text-brand-muted">{req.seatsRequested} seat(s)</p>
                      </div>
                    </div>
                    <p className="text-sm text-brand-muted ml-[52px]">
                      {req.source.name} → {req.destination.name}
                    </p>
                  </div>

                  <div>
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRequestStatus(req._id, 'accepted')}
                          className="px-5 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-display font-bold hover:bg-emerald-700 transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestStatus(req._id, 'rejected')}
                          className="px-5 py-2.5 bg-red-50 text-red-600 rounded-full text-sm font-display font-bold hover:bg-red-100 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {req.status === 'accepted' && (
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 text-xs bg-emerald-500/10 text-emerald-600 rounded-full font-display font-bold">ACCEPTED</span>
                        <button
                          onClick={() => navigate(`/ride/${req._id}`)}
                          className="px-5 py-2.5 bg-brand-dark text-white rounded-full text-sm font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all duration-500"
                        >
                          View Ride & Chat
                        </button>
                      </div>
                    )}
                    {req.status === 'completed' && (
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 text-xs bg-blue-500/10 text-blue-600 rounded-full font-display font-bold">COMPLETED</span>
                        <button
                          onClick={() => navigate(`/ride/${req._id}`)}
                          className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-display font-bold hover:bg-blue-700 transition-all duration-500"
                        >
                          {req.isRatedByDriver ? 'View Details' : '⭐ Rate & Review'}
                        </button>
                      </div>
                    )}
                    {req.status === 'rejected' && (
                      <span className="px-3 py-1 text-xs bg-red-500/10 text-red-600 rounded-full font-display font-bold">REJECTED</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SAVED TAB */}
      {activeTab === 'saved' && (
        <div>
          {savedRides.length === 0 ? (
            <div className="bg-white rounded-2xl border border-brand-gray-light p-16 text-center">
              <MapPin className="h-10 w-10 mx-auto text-brand-muted/30 mb-4" />
              <p className="text-brand-muted mb-6">No saved rides yet.</p>
              <button
                onClick={() => navigate('/book-ride')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500"
              >
                Find a Ride <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedRides.map((ride) => (
                <div key={ride._id} className="bg-white rounded-2xl border border-brand-gray-light overflow-hidden card-lift">
                  <div className="p-6">
                    <div className="space-y-3 mb-5">
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-brand-accent mt-1.5 flex-shrink-0" />
                        <span className="font-display font-semibold text-brand-dark">{ride.source.name}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        <span className="font-display font-semibold text-brand-dark">{ride.destination.name}</span>
                      </div>
                      {ride.seats && (
                        <div className="flex items-center gap-2 text-sm text-brand-muted ml-5">
                          <Users className="h-3.5 w-3.5" />
                          {ride.seats} seats
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-5 border-t border-brand-gray-light">
                      <button
                        onClick={() => handleSavedRide(ride)}
                        className="flex-1 px-4 py-3 bg-brand-dark text-white rounded-full text-sm font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all duration-500"
                      >
                        Use Ride
                      </button>
                      <button
                        onClick={() => deleteSavedRide(ride._id)}
                        className="px-4 py-3 bg-red-50 text-red-600 rounded-full text-sm font-display font-bold hover:bg-red-100 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};