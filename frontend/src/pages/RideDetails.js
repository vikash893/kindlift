import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { socket } from '../lib/socket';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Send, MapPin, Navigation, ArrowLeft, Phone, Mail, User, Calendar, Clock, MessageCircle, Users, Star, Award, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export const RideDetails = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isRated, setIsRated] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchRideData();

    socket.on('receive_message', (message) => {
      if (message.requestId === id) {
        setMessages(prev => {
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRideData = async () => {
    try {
      const [reqRes, msgRes] = await Promise.all([
        api.get(`/requests/${id}`),
        api.get(`/requests/${id}/messages`)
      ]);
      setRequest(reqRes.data);
      setMessages(msgRes.data);
      
      const isPass = user.id === reqRes.data.passengerId._id;
      if (isPass && reqRes.data.isRatedByPassenger) setIsRated(true);
      if (!isPass && reqRes.data.isRatedByDriver) setIsRated(true);

    } catch (error) {
      console.error('Error fetching ride details', error);
      alert('Failed to load ride details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !request || !user) return;

    const isPassenger = user.id === request.passengerId._id;
    const receiverId = isPassenger
      ? request.offerId.driverId._id
      : request.passengerId._id;

    socket.emit('send_message', {
      requestId: id,
      senderId: user.id,
      receiverId,
      text: newMessage
    });

    setNewMessage('');
  };

  const handleCompleteRide = async () => {
    if (!inputCode || inputCode.length !== 4) return alert('Please enter the 4-digit code from the passenger.');
    
    try {
      const res = await api.put(`/requests/${request._id}/complete`, { code: inputCode });
      updateUser({ coins: (user.coins || 0) + res.data.coinsAllocated });
      alert(`Ride completed! You earned ${res.data.coinsAllocated} coins.`);
      fetchRideData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete ride');
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a rating');

    try {
      const isPassenger = user.id === request.passengerId._id;
      const ratedUserId = isPassenger ? request.offerId.driverId._id : request.passengerId._id;

      await api.post('/ratings', {
        rideOfferId: request.offerId._id,
        requestId: request._id,
        ratedUserId,
        rating,
        review,
        raterRole: isPassenger ? 'passenger' : 'driver'
      });
      alert('Thank you for rating!');
      setIsRated(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Ride not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isPassenger = user?.id === request.passengerId._id;
  const otherUser = isPassenger ? request.offerId.driverId : request.passengerId;
  const roleText = isPassenger ? 'Driver' : 'Passenger';
  const roleIcon = isPassenger ? '🚗' : '👤';

  const sourceCoords = [request.source.lat, request.source.lng];
  const destCoords = [request.destination.lat, request.destination.lng];

  const centerCoords = [
    (sourceCoords[0] + destCoords[0]) / 2,
    (sourceCoords[1] + destCoords[1]) / 2
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in-up">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center px-4 py-2 mb-6 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 group"
      >
        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE - Map and Ride Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            <div className="h-64 sm:h-80 w-full bg-gray-100">
              <MapContainer
                center={centerCoords}
                zoom={11}
                className="h-full w-full"
                style={{ background: '#f3f4f6' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={sourceCoords}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">📍 Pickup</p>
                      <p className="text-gray-600">{request.source.name}</p>
                    </div>
                  </Popup>
                </Marker>
                <Marker position={destCoords}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">🎯 Dropoff</p>
                      <p className="text-gray-600">{request.destination.name}</p>
                    </div>
                  </Popup>
                </Marker>
                <Polyline
                  positions={[sourceCoords, destCoords]}
                  color="#3b82f6"
                  weight={3}
                  opacity={0.8}
                />
              </MapContainer>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-blue-600" />
                Ride Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium text-gray-800">{request.source.name}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-medium text-gray-800">{request.destination.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Departure</p>
                    <p className="font-medium text-gray-800">
                      {format(new Date(request.offerId.departureTime), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(request.offerId.departureTime), 'h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Seats Requested</p>
                    <p className="font-medium text-gray-800">{request.seatsRequested} seat(s)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Request Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-semibold mt-1 ${
                      request.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {request.status === 'accepted' && (
                  <div className="pt-4 border-t border-gray-100">
                    {isPassenger ? (
                      <div className="bg-indigo-50 p-4 rounded-xl text-center border-2 border-indigo-100">
                        <p className="text-sm text-indigo-800 font-bold mb-1">Your Ride Completion Code</p>
                        <p className="text-3xl font-black text-indigo-600 tracking-widest">{request.completionCode}</p>
                        <p className="text-xs text-indigo-500 mt-2">Give this code to your driver when you arrive safely.</p>
                      </div>
                    ) : request.offerId.status !== 'completed' && request.status !== 'completed' ? (
                      <div className="bg-green-50 p-4 rounded-xl border-2 border-green-100">
                        <p className="text-sm text-green-800 font-bold mb-2">Complete this Ride</p>
                        <p className="text-xs text-green-600 mb-3">Ask the passenger for their 4-digit completion code to earn coins.</p>
                        <div className="flex space-x-2">
                          <input 
                            type="text" 
                            maxLength={4}
                            placeholder="Code" 
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            className="w-24 text-center font-bold tracking-widest border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                          />
                          <button
                            onClick={handleCompleteRide}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all shadow-md flex items-center justify-center animate-pulse"
                          >
                            <CheckCircle className="h-5 w-5 mr-1" /> Complete
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
                
                {request.status === 'completed' && !isRated && (
                  <div className="pt-4 border-t border-gray-100 bg-blue-50 p-4 rounded-xl mt-4">
                    <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                      <Star className="h-5 w-5 mr-1 text-yellow-500 fill-current" />
                      Rate your {roleText.toLowerCase()}
                    </h3>
                    <div className="flex space-x-2 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`focus:outline-none transition-transform hover:scale-125 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className={`h-8 w-8 ${rating >= star ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Leave a short review (optional)"
                      className="w-full text-sm p-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    ></textarea>
                    <button
                      onClick={handleRatingSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
                    >
                      Submit Rating
                    </button>
                  </div>
                )}
                {isRated && (
                  <div className="pt-4 border-t border-gray-100">
                     <p className="text-green-600 font-bold flex items-center">
                       <CheckCircle className="h-5 w-5 mr-2" />
                       Rating submitted!
                     </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - User Info and Chat */}
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
          {/* User Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">{roleIcon}</span>
              {roleText} Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {otherUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{otherUser.name}</p>
                  <p className="text-xs text-gray-500">@{otherUser.name.toLowerCase().replace(/\s/g, '')}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{otherUser.email}</span>
                </div>
                {otherUser.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{otherUser.phone}</span>
                  </div>
                )}
              </div>
              
              {request.status === 'accepted' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-green-800 font-medium">
                      ✓ Ride confirmed! You can now chat with your {roleText.toLowerCase()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <h3 className="text-white font-semibold flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat with {otherUser.name.split(' ')[0]}
              </h3>
              <p className="text-blue-100 text-xs mt-1">Real-time messages</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm">No messages yet</p>
                  <p className="text-gray-400 text-xs">Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isOwnMessage = msg.senderId === user?.id;
                  return (
                    <div
                      key={idx}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.text}</p>
                        <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-400'}`}>
                          {format(new Date(msg.createdAt), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none shadow-md"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};