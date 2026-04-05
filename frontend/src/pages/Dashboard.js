import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { socket } from '../lib/socket';
import { MapPin, Users, Calendar, Clock, CheckCircle, XCircle, User } from 'lucide-react';
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

  const statusStyle = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-14 w-14 rounded-2xl overflow-hidden bg-brand-cream border-2 border-brand-accent/20 flex items-center justify-center">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <User className="h-6 w-6 text-brand-muted" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Welcome back, {user?.name}!</h1>
          <p className="text-sm text-brand-muted">Manage your rides and bookings here.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white rounded-xl p-1.5 shadow-card border border-gray-100 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-brand-dark text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-dark hover:bg-brand-cream'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PASSENGER TAB */}
      {activeTab === 'passenger' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-brand-dark">My Ride Requests</h2>
          {myRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-12 text-center">
              <Users className="h-10 w-10 mx-auto text-brand-muted/40 mb-3" />
              <p className="text-brand-muted mb-4">You haven't requested any rides yet.</p>
              <button
                onClick={() => navigate('/book-ride')}
                className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-charcoal transition-all"
              >
                Book a Ride
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myRequests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden card-lift"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-lg font-semibold border ${statusStyle(req.status)}`}
                      >
                        {req.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-brand-muted flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(req.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>

                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-brand-accent flex-shrink-0 mt-0.5" />
                        <span className="text-brand-dark">{req.source.name}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-brand-dark">{req.destination.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-brand-muted">
                        <Users className="h-4 w-4" />
                        {req.seatsRequested} seat(s) requested
                      </div>
                    </div>

                    {req.status === 'accepted' && req.offerId?.driverId && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold text-brand-dark mb-3">Driver Details</p>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-9 w-9 rounded-xl overflow-hidden bg-brand-cream border border-gray-200 flex items-center justify-center">
                            {req.offerId.driverId.profilePhoto ? (
                              <img src={req.offerId.driverId.profilePhoto} alt={req.offerId.driverId.name} className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-4 w-4 text-brand-muted" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-brand-dark">{req.offerId.driverId.name}</p>
                            <p className="text-xs text-brand-muted">{req.offerId.driverId.phone || req.offerId.driverId.email}</p>
                          </div>
                        </div>

                        <div className="bg-brand-cream rounded-xl p-3 text-center mb-3 border border-gray-100">
                          <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-1">Your Code</p>
                          <p className="text-2xl font-black text-brand-dark tracking-[0.2em]">{req.completionCode}</p>
                        </div>

                        <button
                          onClick={() => navigate(`/ride/${req._id}`)}
                          className="w-full px-4 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-charcoal transition-all"
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
          <div>
            <h2 className="text-lg font-semibold text-brand-dark mb-4">Incoming Requests</h2>

            {incomingRequests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-12 text-center">
                <Users className="h-10 w-10 mx-auto text-brand-muted/40 mb-3" />
                <p className="text-brand-muted">No incoming requests right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 flex flex-col sm:flex-row justify-between items-center gap-4 card-lift"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-xl bg-brand-cream flex items-center justify-center text-brand-dark font-bold text-sm">
                          {req.passengerId?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-brand-dark text-sm">{req.passengerId?.name}</span>
                          <p className="text-xs text-brand-muted">{req.seatsRequested} seat(s)</p>
                        </div>
                      </div>
                      <p className="text-sm text-brand-muted ml-12">
                        {req.source.name} → {req.destination.name}
                      </p>
                    </div>

                    <div>
                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRequestStatus(req._id, 'accepted')}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequestStatus(req._id, 'rejected')}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {req.status === 'accepted' && (
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-3 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-lg font-semibold">ACCEPTED</span>
                          <button
                            onClick={() => navigate(`/ride/${req._id}`)}
                            className="px-4 py-2 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-charcoal transition-all"
                          >
                            View Ride & Chat
                          </button>
                        </div>
                      )}

                      {req.status === 'rejected' && (
                        <span className="px-3 py-1 text-xs bg-red-50 text-red-700 rounded-lg font-semibold">REJECTED</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SAVED TAB */}
      {activeTab === 'saved' && (
        <div>
          {savedRides.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-12 text-center">
              <MapPin className="h-10 w-10 mx-auto text-brand-muted/40 mb-3" />
              <p className="text-brand-muted mb-4">No saved rides yet.</p>
              <button
                onClick={() => navigate('/book-ride')}
                className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-charcoal transition-all"
              >
                Find a Ride
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedRides.map((ride) => (
                <div
                  key={ride._id}
                  className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden card-lift"
                >
                  <div className="p-6">
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-brand-accent flex-shrink-0 mt-0.5" />
                        <span className="font-medium text-brand-dark">{ride.source.name}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="font-medium text-brand-dark">{ride.destination.name}</span>
                      </div>
                      {ride.seats && (
                        <div className="flex items-center gap-2 text-sm text-brand-muted">
                          <Users className="h-4 w-4" />
                          {ride.seats} seats
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleSavedRide(ride)}
                        className="flex-1 px-3 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-charcoal transition-all"
                      >
                        Use Ride
                      </button>
                      <button
                        onClick={() => deleteSavedRide(ride._id)}
                        className="px-3 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all"
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