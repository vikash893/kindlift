import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { socket } from '../lib/socket';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Send, MapPin, Navigation, ArrowLeft, Phone, Mail, User, Calendar, Clock, MessageCircle, Users, Star, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
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
        setMessages(prev => { if (prev.some(m => m._id === message._id)) return prev; return [...prev, message]; });
      }
    });
    return () => { socket.off('receive_message'); };
  }, [id]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);



  const fetchRideData = async () => {
    try {
      const [reqRes, msgRes] = await Promise.all([api.get(`/requests/${id}`), api.get(`/requests/${id}/messages`)]);
      setRequest(reqRes.data); setMessages(msgRes.data);
      const isPass = user.id === reqRes.data.passengerId._id;
      if (isPass && reqRes.data.isRatedByPassenger) setIsRated(true);
      if (!isPass && reqRes.data.isRatedByDriver) setIsRated(true);
    } catch (error) { console.error('Error fetching ride details', error); alert('Failed to load ride details'); navigate('/dashboard'); }
    finally { setLoading(false); }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !request || !user) return;
    const isPassenger = user.id === request.passengerId._id;
    const receiverId = isPassenger ? request.offerId.driverId._id : request.passengerId._id;
    socket.emit('send_message', { requestId: id, senderId: user.id, receiverId, text: newMessage });
    setNewMessage('');
  };

  const handleCompleteRide = async () => {
    if (!inputCode || inputCode.length !== 4) return alert('Please enter the 4-digit code.');
    try {
      const res = await api.put(`/requests/${request._id}/complete`, { code: inputCode });
      updateUser({ coins: (user.coins || 0) + res.data.coinsAllocated });
      alert(`Ride completed! You earned ${res.data.coinsAllocated} coins.`);
      fetchRideData();
    } catch (err) { alert(err.response?.data?.message || 'Failed to complete ride'); }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a rating');
    try {
      const isPassenger = user.id === request.passengerId._id;
      const ratedUserId = isPassenger ? request.offerId.driverId._id : request.passengerId._id;
      await api.post('/ratings', { rideOfferId: request.offerId._id, requestId: request._id, ratedUserId, rating, review, raterRole: isPassenger ? 'passenger' : 'driver' });
      alert('Thank you for rating!'); setIsRated(true);
    } catch (err) { alert(err.response?.data?.message || 'Failed to submit rating'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center"><div className="loader-spinner mx-auto mb-4" /><p className="text-brand-muted text-sm">Loading ride details...</p></div>
    </div>
  );

  if (!request) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <MapPin className="h-10 w-10 mx-auto text-brand-muted/30 mb-4" />
        <p className="text-brand-muted mb-4">Ride not found</p>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-brand-dark text-white rounded-full text-sm font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all duration-500">Back to Dashboard</button>
      </div>
    </div>
  );

  const isPassenger = user?.id === request.passengerId._id;
  const otherUser = isPassenger ? request.offerId.driverId : request.passengerId;
  const roleText = isPassenger ? 'Driver' : 'Passenger';
  const sourceCoords = [request.source.lat, request.source.lng];
  const destCoords = [request.destination.lat, request.destination.lng];
  const centerCoords = [(sourceCoords[0] + destCoords[0]) / 2, (sourceCoords[1] + destCoords[1]) / 2];

  const statusBadge = (s) => {
    if (s === 'accepted') return 'bg-emerald-500/10 text-emerald-600';
    if (s === 'rejected') return 'bg-red-500/10 text-red-600';
    if (s === 'completed') return 'bg-blue-500/10 text-blue-600';
    return 'bg-amber-500/10 text-amber-600';
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pt-28">
      <button onClick={() => navigate('/dashboard')} className="inline-flex items-center px-4 py-2 mb-8 text-brand-accent hover:text-brand-accent-hover font-display font-semibold transition-colors group text-sm">
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — Map & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-brand-gray-light overflow-hidden">
            <div className="h-64 sm:h-80 w-full bg-gray-100">
              <MapContainer center={centerCoords} zoom={11} className="h-full w-full" style={{ background: '#f3f4f6' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                <Marker position={sourceCoords}><Popup><p className="font-display font-bold text-sm">Pickup</p><p className="text-xs text-gray-600">{request.source.name}</p></Popup></Marker>
                <Marker position={destCoords}><Popup><p className="font-display font-bold text-sm">Dropoff</p><p className="text-xs text-gray-600">{request.destination.name}</p></Popup></Marker>
                <Polyline positions={[sourceCoords, destCoords]} color="#e8a838" weight={3} opacity={0.8} />
              </MapContainer>
            </div>

            <div className="p-6 space-y-5">
              <h2 className="font-display text-lg font-bold text-brand-dark flex items-center gap-2"><Navigation className="h-4 w-4 text-brand-accent" /> Ride Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                  <div><p className="text-xs text-brand-muted">From</p><p className="font-display font-semibold text-brand-dark text-sm">{request.source.name}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  <div><p className="text-xs text-brand-muted">To</p><p className="font-display font-semibold text-brand-dark text-sm">{request.destination.name}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-brand-muted flex-shrink-0 mt-1" />
                  <div><p className="text-xs text-brand-muted">Departure</p><p className="font-display font-semibold text-brand-dark text-sm">{format(new Date(request.offerId.departureTime), 'EEE, MMM d, yyyy · h:mm a')}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-brand-muted flex-shrink-0 mt-1" />
                  <div><p className="text-xs text-brand-muted">Seats</p><p className="font-display font-semibold text-brand-dark text-sm">{request.seatsRequested} seat(s)</p></div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-gray-light">
                <span className={`inline-flex px-3 py-1 text-xs rounded-full font-display font-bold ${statusBadge(request.status)}`}>{request.status.toUpperCase()}</span>
              </div>

              {request.status === 'accepted' && (
                <div className="pt-4 border-t border-brand-gray-light">
                  {isPassenger ? (
                    <div className="bg-brand-dark/5 rounded-xl p-5 text-center">
                      <p className="text-xs font-display font-bold text-brand-muted uppercase tracking-widest mb-2">Your Ride Code</p>
                      <p className="text-4xl font-display font-black text-brand-dark tracking-widest">{request.completionCode}</p>
                      <p className="text-xs text-brand-muted mt-3">Give this code to your driver on arrival.</p>
                    </div>
                  ) : request.offerId.status !== 'completed' && request.status !== 'completed' ? (
                    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                      <p className="font-display font-bold text-emerald-800 mb-1">Complete this Ride</p>
                      <p className="text-xs text-emerald-600 mb-4">Enter the passenger's 4-digit code to earn coins.</p>
                      <div className="flex gap-2">
                        <input type="text" maxLength={4} placeholder="Code" value={inputCode} onChange={(e) => setInputCode(e.target.value)}
                          className="w-28 text-center font-display font-black tracking-widest border border-emerald-200 rounded-xl py-3 focus:ring-2 focus:ring-emerald-400 outline-none" />
                        <button onClick={handleCompleteRide} className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-full text-sm font-display font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                          <CheckCircle className="h-4 w-4" /> Complete
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {request.status === 'completed' && !isRated && (
                <div className="pt-4 border-t border-brand-gray-light bg-brand-dark/5 rounded-xl p-5">
                  <h3 className="font-display font-bold text-brand-dark mb-3 flex items-center gap-2"><Star className="h-4 w-4 text-amber-400" /> Rate your {roleText.toLowerCase()}</h3>
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setRating(s)} className={`transition-transform hover:scale-110 ${rating >= s ? 'text-amber-400' : 'text-gray-300'}`}>
                        <Star className={`h-7 w-7 ${rating >= s ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                  <textarea placeholder="Leave a review (optional)" className="w-full text-sm p-3 rounded-xl border border-brand-gray-light focus:ring-2 focus:ring-brand-accent/30 outline-none mb-3 bg-white" value={review} onChange={(e) => setReview(e.target.value)} />
                  

                  <button onClick={handleRatingSubmit} className="px-6 py-3 bg-brand-dark text-white rounded-full text-sm font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all duration-500">Submit Rating</button>
                </div>
              )}
              {isRated && <div className="pt-4 border-t border-brand-gray-light"><p className="text-emerald-600 font-display font-bold flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4" /> Rating submitted!</p></div>}
            </div>
          </div>
        </div>

        {/* RIGHT — User Info & Chat */}
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
          <div className="bg-white rounded-2xl border border-brand-gray-light p-6">
            <h3 className="text-sm font-display font-bold text-brand-dark mb-4">{roleText} Details</h3>
            <div className="flex items-center gap-3 p-3 bg-brand-dark/5 rounded-xl mb-4">
              <div className="h-11 w-11 rounded-xl bg-brand-dark flex items-center justify-center text-white font-display font-bold">
                {otherUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-display font-bold text-brand-dark text-sm">{otherUser.name}</p>
                <p className="text-xs text-brand-muted">@{otherUser.name.toLowerCase().replace(/\s/g, '')}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-brand-muted"><Mail className="h-3.5 w-3.5" />{otherUser.email}</div>
              {otherUser.phone && <div className="flex items-center gap-2 text-sm text-brand-muted"><Phone className="h-3.5 w-3.5" />{otherUser.phone}</div>}
            </div>
            {request.status === 'accepted' && (
              <div className="mt-4 pt-4 border-t border-brand-gray-light">
                <div className="bg-emerald-50 rounded-lg p-2 text-center"><p className="text-xs text-emerald-700 font-display font-bold">✓ Ride confirmed</p></div>
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-brand-gray-light overflow-hidden">
            <div className="bg-brand-dark p-4">
              <h3 className="text-white font-display font-bold flex items-center gap-2 text-sm"><MessageCircle className="h-4 w-4" /> Chat with {otherUser.name.split(' ')[0]}</h3>
              <p className="text-white/40 text-xs mt-1">Real-time messages</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-dark/[0.02]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center"><MessageCircle className="h-10 w-10 text-brand-muted/20 mb-2" /><p className="text-brand-muted text-sm">No messages yet</p></div>
              ) : messages.map((msg, idx) => {
                const isOwn = msg.senderId === user?.id;
                return (
                  <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${isOwn ? 'bg-brand-dark text-white' : 'bg-white border border-brand-gray-light text-brand-dark'}`}>
                      <p className="text-sm break-words">{msg.text}</p>
                      <p className={`text-xs mt-1.5 ${isOwn ? 'text-white/40' : 'text-brand-muted'}`}>{format(new Date(msg.createdAt), 'h:mm a')}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-brand-gray-light">
              <div className="flex gap-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-brand-gray-light rounded-full text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none" />
                <button type="submit" disabled={!newMessage.trim()}
                  className="px-4 py-3 bg-brand-dark text-white rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};