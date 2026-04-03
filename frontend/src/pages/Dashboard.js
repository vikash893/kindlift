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
      setIncomingRequests(prev => [request, ...prev]);
    });

    socket.on('request_updated', (request) => {
      setMyRequests(prev => prev.map(r => r._id === request._id ? request : r));
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
        api.get('/saved-rides')
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
      setSavedRides(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      console.error('Error deleting saved ride', error);
    }
  };

  const handleSavedRide = (ride) => {
    navigate('/offer-ride', {
      state: {
        source: ride.source.name,
        destination: ride.destination.name,
        seats: ride.seats
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="flex items-center space-x-4 mb-8 animate-fade-in-up">
        <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-md flex items-center justify-center">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-gray-500" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your rides and bookings here.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('passenger')}
            className={`${
              activeTab === 'passenger'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
          >
            My Bookings (Passenger)
          </button>
          <button
            onClick={() => setActiveTab('driver')}
            className={`${
              activeTab === 'driver'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
          >
            My Offers (Driver)
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`${
              activeTab === 'saved'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
          >
            Saved Rides
          </button>
        </nav>
      </div>

      {/* PASSENGER TAB */}
      {activeTab === 'passenger' && (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-semibold text-gray-800">My Ride Requests</h2>
          {myRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">You haven't requested any rides yet.</p>
              <button
                onClick={() => navigate('/book-ride')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200"
              >
                Book a Ride
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myRequests.map(req => (
                <div
                  key={req._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
                          req.status === 'accepted'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : req.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        {req.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(req.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{req.source.name}</span>
                      </div>
                      <div className="flex items-start text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{req.destination.name}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{req.seatsRequested} seat(s) requested</span>
                      </div>
                    </div>

                    {req.status === 'accepted' && req.offerId?.driverId && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Driver Details:</p>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                            {req.offerId.driverId.profilePhoto ? (
                              <img
                                src={req.offerId.driverId.profilePhoto}
                                alt={req.offerId.driverId.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{req.offerId.driverId.name}</p>
                            <p className="text-xs text-gray-500">{req.offerId.driverId.phone || req.offerId.driverId.email}</p>
                          </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-center mb-3">
                          <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-1">Your Code</p>
                          <p className="text-2xl font-black text-indigo-600 tracking-[0.2em]">{req.completionCode}</p>
                        </div>

                        <button
                          onClick={() => navigate(`/ride/${req._id}`)}
                          className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md"
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
  <div className="space-y-8 animate-fade-in-up">
    
    {/* Incoming Requests */}
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Incoming Requests</h2>

      {incomingRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No incoming requests right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {incomingRequests.map(req => (
            <div
              key={req._id}
              className="bg-white rounded-lg shadow-md border border-gray-100 p-5 flex flex-col sm:flex-row justify-between items-center hover:shadow-lg transition-all duration-300"
            >
              {/* LEFT SIDE */}
              <div className="flex-1 mb-4 sm:mb-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {req.passengerId?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      {req.passengerId?.name}
                    </span>
                    <p className="text-xs text-gray-500">
                      {req.seatsRequested} seat(s)
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {req.source.name} → {req.destination.name}
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div>
                {req.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRequestStatus(req._id, 'accepted')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRequestStatus(req._id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {req.status === 'accepted' && (
                  <div className="flex flex-col items-end space-y-2">
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      ACCEPTED
                    </span>

                    <button
                      onClick={() => navigate(`/ride/${req._id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      View Ride & Chat
                    </button>
                  </div>
                )}

                {req.status === 'rejected' && (
                  <span className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    REJECTED
                  </span>
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
        <div className="animate-fade-in-up">
          {savedRides.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No saved rides yet.</p>
              <button
                onClick={() => navigate('/book-ride')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200"
              >
                Find a Ride
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedRides.map(ride => (
                <div
                  key={ride._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{ride.source.name}</span>
                      </div>
                      <div className="flex items-start text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{ride.destination.name}</span>
                      </div>
                      {ride.seats && (
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{ride.seats} seats</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleSavedRide(ride)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                      >
                        Use Ride
                      </button>
                      <button
                        onClick={() => deleteSavedRide(ride._id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all duration-200"
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