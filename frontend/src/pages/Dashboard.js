import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { socket } from '../lib/socket';
import { MapPin, Users, Calendar, Clock, CheckCircle, XCircle, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('passenger');
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
      alert('Failed to update request status');
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
      <div className="flex items-center gap-5 mb-10">
        <div className="h-14 w-14 rounded-2xl overflow-hidden bg-brand-dark/5 border border-brand-gray-light flex items-center justify-center">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <User className="h-6 w-6 text-brand-muted" />
          )}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">Welcome back, {user?.name}</h1>
          <p className="text-brand-muted text-sm mt-1">Manage your rides and bookings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-10 border-b border-brand-gray-light">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 text-sm font-display font-semibold transition-all duration-300 border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'text-brand-dark border-brand-accent'
                : 'text-brand-muted border-transparent hover:text-brand-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

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