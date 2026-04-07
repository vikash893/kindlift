import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { MapPin, Users, Calendar, Clock, Save, FileText, Hash, Camera, XCircle, ArrowRight } from 'lucide-react';

export const OfferRide = () => {
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const [source, setSource] = useState(location.state?.source || '');
  const [destination, setDestination] = useState(location.state?.destination || '');
  const [seats, setSeats] = useState(location.state?.seats || 3);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [saveRoute, setSaveRoute] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehiclePhoto, setVehiclePhoto] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const fetchLocationSuggestions = async (query, type) => {
    if (!query || query.length < 2) return;
    try {
      const res = await api.get(`/location/search?q=${query}`);
      if (type === "source") setSourceSuggestions(res.data);
      else setDestinationSuggestions(res.data);
    } catch (err) { console.log(err); }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError('Photo must be less than 5MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => { setVehiclePhoto(reader.result); setPhotoPreview(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const departureTime = new Date(`${date}T${time}`).toISOString();
      const payload = { sourceName: source, destinationName: destination, seatsAvailable: seats, departureTime };
      if (!user?.isDriverVerified) {
        if (!vehicleNumber || !licenseNumber || !vehiclePhoto) { setError('Please provide all verification details'); setLoading(false); return; }
        payload.vehicleNumber = vehicleNumber; payload.licenseNumber = licenseNumber; payload.vehiclePhoto = vehiclePhoto;
      }
      await api.post('/rides', payload);
      if (!user?.isDriverVerified) updateUser({ isDriverVerified: true });
      if (saveRoute) await api.post('/saved-rides', { sourceName: source, destinationName: destination, seats });
      navigate('/dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Failed to create ride offer'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 pt-28">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-2 flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-dark rounded-2xl flex items-center justify-center">
            <Users className="h-5 w-5 text-brand-accent" />
          </div>
          Offer a Ride
        </h1>
        <p className="text-brand-muted ml-[60px]">Share your journey and split costs</p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-gray-light p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-display font-semibold text-brand-dark mb-3">
              <MapPin className="h-3.5 w-3.5 inline mr-1 text-brand-accent" /> Leaving from
            </label>
            <div className="relative">
              <input type="text" required className="input-modern" placeholder="Enter pickup location"
                value={source} onChange={(e) => { setSource(e.target.value); fetchLocationSuggestions(e.target.value, "source"); }} />
              {sourceSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-brand-gray-light rounded-xl mt-1 max-h-40 overflow-y-auto shadow-card">
                  {sourceSuggestions.map((item, index) => (
                    <li key={index} className="p-3 hover:bg-brand-dark/5 cursor-pointer text-sm transition-colors"
                      onClick={() => { setSource(item.display_name); setSourceSuggestions([]); }}>
                      {item.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-display font-semibold text-brand-dark mb-3">
              <MapPin className="h-3.5 w-3.5 inline mr-1 text-red-400" /> Going to
            </label>
            <div className="relative">
              <input type="text" required className="input-modern" placeholder="Enter destination"
                value={destination} onChange={(e) => { setDestination(e.target.value); fetchLocationSuggestions(e.target.value, "destination"); }} />
              {destinationSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-brand-gray-light rounded-xl mt-1 max-h-40 overflow-y-auto shadow-card">
                  {destinationSuggestions.map((item, index) => (
                    <li key={index} className="p-3 hover:bg-brand-dark/5 cursor-pointer text-sm transition-colors"
                      onClick={() => { setDestination(item.display_name); setDestinationSuggestions([]); }}>
                      {item.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3"><Calendar className="h-3.5 w-3.5 inline mr-1" /> Date</label>
              <input type="date" required className="input-modern" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3"><Clock className="h-3.5 w-3.5 inline mr-1" /> Time</label>
              <input type="time" required className="input-modern" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-display font-semibold text-brand-dark mb-3"><Users className="h-3.5 w-3.5 inline mr-1" /> Available Seats</label>
            <input type="number" min="1" max="8" required className="input-modern" value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
          </div>

          <label className="flex items-center gap-3 py-2 cursor-pointer">
            <input type="checkbox" checked={saveRoute} onChange={(e) => setSaveRoute(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent" />
            <span className="text-sm text-brand-muted flex items-center gap-1"><Save className="h-3.5 w-3.5" /> Save this route</span>
          </label>

          {!user?.isDriverVerified && (
            <div className="border-t border-brand-gray-light pt-8 mt-4 space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-brand-dark flex items-center gap-2 mb-1"><FileText className="h-4 w-4 text-brand-accent" /> Driver Verification</h3>
                <p className="text-sm text-brand-muted">First-time driver? Provide your vehicle details.</p>
              </div>
              <div>
                <label className="block text-sm font-display font-semibold text-brand-dark mb-3"><Hash className="h-3.5 w-3.5 inline mr-1" />Vehicle Number</label>
                <input type="text" placeholder="e.g., KA 01 AB 1234" className="input-modern" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-display font-semibold text-brand-dark mb-3"><FileText className="h-3.5 w-3.5 inline mr-1" />License Number</label>
                <input type="text" placeholder="Driver's license number" className="input-modern" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-display font-semibold text-brand-dark mb-3"><Camera className="h-3.5 w-3.5 inline mr-1" />Vehicle Photo</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-brand-gray-light rounded-xl p-6 text-center hover:border-brand-accent transition-colors">
                      <Camera className="h-6 w-6 mx-auto text-brand-muted mb-2" /><p className="text-sm text-brand-muted">Click to upload</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                  {photoPreview && (
                    <div className="relative">
                      <img src={photoPreview} alt="Vehicle" className="h-20 w-28 object-cover rounded-xl border border-brand-gray-light" />
                      <button type="button" onClick={() => { setVehiclePhoto(''); setPhotoPreview(''); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><XCircle className="h-3.5 w-3.5" /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full group flex items-center justify-center gap-2 px-6 py-4 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 disabled:opacity-50 mt-4">
            {loading ? (<><div className="loader-spinner !w-4 !h-4 !border-2" /> Publishing...</>) : (<>Publish Ride <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>)}
          </button>
        </form>
      </div>
    </div>
  );
};