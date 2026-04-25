import React, { useState } from 'react';
import { ButtonLoader } from '../components/ButtonLoader';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { useLocationSearch } from '../lib/useLocationSearch';
import { LocationInput } from '../components/LocationInput';
import { MapPin, Users, Calendar, Clock, Save, FileText, Hash, Camera, XCircle, ArrowRight, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';

export const OfferRide = () => {
  const location = useLocation();
  const { user, updateUser } = useAuth();
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

  // Each field gets its own isolated hook instance — no cross-field interference
  const source = useLocationSearch(location.state?.source || '');
  const destination = useLocationSearch(location.state?.destination || '');

  const verificationStatus = user?.driverVerificationStatus || 'none';
  const isPending = verificationStatus === 'pending';
  const isRejected = verificationStatus === 'rejected';

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError('Photo must be less than 5MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => { setVehiclePhoto(reader.result); setPhotoPreview(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleResubmit = () => {
    updateUser({ driverVerificationStatus: 'none', isDriverVerified: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (!source.coords || !destination.coords) {
        setError("Please select valid locations from the suggestions dropdown");
        setLoading(false);
        return;
      }
      const departureTime = new Date(`${date}T${time}`).toISOString();
      const payload = {
        source: { name: source.query, lat: parseFloat(source.coords.lat), lng: parseFloat(source.coords.lng) },
        destination: { name: destination.query, lat: parseFloat(destination.coords.lat), lng: parseFloat(destination.coords.lng) },
        seatsAvailable: seats,
        departureTime
      };
      if (!user?.isDriverVerified) {
        if (!vehicleNumber || !licenseNumber || !vehiclePhoto) { setError('Please provide all verification details'); setLoading(false); return; }
        payload.vehicleNumber = vehicleNumber; payload.licenseNumber = licenseNumber; payload.vehiclePhoto = vehiclePhoto;
      }
      const response = await api.post('/rides', payload);

      // Handle 202 — docs submitted, pending review
      if (response.status === 202) {
        updateUser({ driverVerificationStatus: 'pending' });
        return;
      }

      if (!user?.isDriverVerified && response.data) updateUser({ isDriverVerified: true, driverVerificationStatus: 'approved' });
      if (saveRoute) await api.post('/saved-rides', { sourceName: source.query, destinationName: destination.query, seats });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create ride offer';
      const vs = err.response?.data?.verificationStatus;
      if (vs === 'pending') {
        updateUser({ driverVerificationStatus: 'pending' });
      } else if (vs === 'rejected') {
        updateUser({ driverVerificationStatus: 'rejected' });
      }
      setError(msg);
    }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 lg:py-8">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-2 flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-dark rounded-2xl flex items-center justify-center">
            <Users className="h-5 w-5 text-brand-accent" />
          </div>
          Offer a Ride
        </h1>
        <p className="text-brand-muted ml-[60px]">Share your journey and split costs</p>
      </div>

      {/* ─── Verification Status Banners ─────────────────── */}
      {isPending && (
        <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Loader2 className="h-6 w-6 text-amber-600 animate-spin" />
            </div>
            <div>
              <h3 className="font-display font-bold text-amber-900 text-lg mb-1">Verification In Progress</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                Your documents have been submitted and are being reviewed by our admin team.
                You will be able to offer rides once your verification is approved.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-amber-600">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-semibold">Typical review time: 24-48 hours</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="mb-8 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-red-900 text-lg mb-1">Verification Rejected</h3>
              <p className="text-red-700 text-sm leading-relaxed mb-3">
                Your driver verification was not approved. Please review the feedback below and re-submit your documents.
              </p>
              {user?.driverVerificationNote && (
                <div className="bg-white/60 rounded-xl p-3 mb-3 border border-red-100">
                  <p className="text-sm text-red-800 font-medium">Admin feedback:</p>
                  <p className="text-sm text-red-700 mt-1">{user.driverVerificationNote}</p>
                </div>
              )}
              <button onClick={handleResubmit}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-full text-sm font-display font-bold hover:bg-red-700 transition-all">
                <FileText className="h-4 w-4" /> Re-submit Documents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Form ──────────────────────────────────── */}
      {!isPending && (
      <div className="bg-white rounded-2xl border border-brand-gray-light p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <LocationInput
            field={source}
            id="offer-source"
            label="Leaving from"
            placeholder="Type a city, village or landmark..."
            icon={MapPin}
            iconColor="text-brand-accent"
            showCurrentLocation={true}
          />

          <LocationInput
            field={destination}
            id="offer-destination"
            label="Going to"
            placeholder="Type your destination..."
            icon={MapPin}
            iconColor="text-red-400"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3"><Calendar className="h-3.5 w-3.5 inline mr-1" /> Date</label>
              <input type="date" required className="input-modern" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
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

          {!user?.isDriverVerified && !isRejected && (
            <div className="border-t border-brand-gray-light pt-8 mt-4 space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-brand-dark flex items-center gap-2 mb-1"><FileText className="h-4 w-4 text-brand-accent" /> Driver Verification</h3>
                <p className="text-sm text-brand-muted">First-time driver? Provide your vehicle details for admin verification.</p>
              </div>
              <div>
                <label className="block text-sm font-display font-semibold text-brand-dark mb-3"><Hash className="h-3.5 w-3.5 inline mr-1" />Vehicle Number</label>
                <input type="text" placeholder="e.g., KA 01 AB 1234" className="input-modern" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())} />
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
            {loading ? (<ButtonLoader text="Publishing..." />) : (<>Publish Ride <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>)}
          </button>
        </form>
      </div>
      )}
    </div>
  );
};