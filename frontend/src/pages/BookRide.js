import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAlert } from '../components/CustomAlert';
import { MapPin, Users, Calendar, Search, Navigation, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export const BookRide = () => {
  const { toast, success: showSuccess } = useAlert();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map());

  const cleanupRequests = useCallback(() => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
  }, []);

  const fetchLocationSuggestions = useCallback((query, type) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!query || query.length < 3) {
      type === "source" ? setSourceSuggestions([]) : setDestinationSuggestions([]);
      return;
    }
    timeoutRef.current = setTimeout(async () => {
      const key = `${query.toLowerCase()}_${type}`;
      const cached = cacheRef.current.get(key);
      if (cached && Date.now() - cached.timestamp < 3600000) {
        type === "source" ? setSourceSuggestions(cached.data) : setDestinationSuggestions(cached.data);
        return;
      }
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      try {
        const res = await api.get(`/location/search?q=${encodeURIComponent(query)}`, {
          signal: abortControllerRef.current.signal, timeout: 10000,
        });
        if (res.data && Array.isArray(res.data)) {
          const limited = res.data.slice(0, 5);
          cacheRef.current.set(key, { data: limited, timestamp: Date.now() });
          type === "source" ? setSourceSuggestions(limited) : setDestinationSuggestions(limited);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          type === "source" ? setSourceSuggestions([]) : setDestinationSuggestions([]);
        }
      } finally { abortControllerRef.current = null; }
    }, 800);
  }, []);

  useEffect(() => { return () => cleanupRequests(); }, [cleanupRequests]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      if (!sourceCoords || !destinationCoords) {
        setError("Please select valid locations from the suggestions dropdown");
        setLoading(false);
        return;
      }
      if (seats < 1 || seats > 8) {
        setError("Please select between 1 and 8 seats");
        setLoading(false);
        return;
      }
      const res = await api.get('/rides/search', {
        params: {
          sourceLat: sourceCoords.lat, sourceLng: sourceCoords.lng,
          destLat: destinationCoords.lat, destLng: destinationCoords.lng, seats
        },
        timeout: 15000
      });
      setSearchResults(res.data);
      if (res.data.length === 0) setError("No rides found. Try adjusting your search criteria.");
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.');
      setSearchResults([]);
    } finally { setLoading(false); }
  };

  const requestRide = async (offerId) => {
    if (!sourceCoords || !destinationCoords) { toast('warning', 'Please select valid locations from suggestions'); return; }
    try {
      await api.post('/requests', {
        offerId, seatsRequested: seats,
        source: { name: source, lat: sourceCoords.lat, lng: sourceCoords.lng },
        destination: { name: destination, lat: destinationCoords.lat, lng: destinationCoords.lng },
      });
      showSuccess('Ride requested successfully! Check your dashboard for updates.', 'Request Sent 🚗');
      navigate('/dashboard');
    } catch (err) { toast('error', err.response?.data?.message || 'Failed to request ride'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 pt-28">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-2 flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-dark rounded-2xl flex items-center justify-center">
            <Search className="h-5 w-5 text-brand-accent" />
          </div>
          Find a Ride
        </h1>
        <p className="text-brand-muted ml-[60px]">Search for available rides on your route</p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-gray-light p-6 md:p-8 mb-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3">
                <MapPin className="h-3.5 w-3.5 inline mr-1 text-brand-accent" /> Leaving from
              </label>
              <input
                type="text" required className="input-modern" placeholder="Enter departure city..."
                value={source}
                onChange={(e) => { setSource(e.target.value); setSourceCoords(null); fetchLocationSuggestions(e.target.value, "source"); }}
                onBlur={() => setTimeout(() => setSourceSuggestions([]), 300)}
              />
              {sourceSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-brand-gray-light rounded-xl mt-1 max-h-40 overflow-y-auto shadow-card">
                  {sourceSuggestions.map((item, index) => (
                    <li key={`source-${index}-${item.place_id || index}`}
                      className="p-3 hover:bg-brand-dark/5 cursor-pointer text-sm transition-colors"
                      onClick={() => { setSource(item.display_name); setSourceCoords({ lat: Number(item.lat), lng: Number(item.lon) }); setSourceSuggestions([]); cleanupRequests(); }}>
                      {item.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3">
                <MapPin className="h-3.5 w-3.5 inline mr-1 text-red-400" /> Going to
              </label>
              <input
                type="text" required className="input-modern" placeholder="Enter destination city..."
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setDestinationCoords(null); fetchLocationSuggestions(e.target.value, "destination"); }}
                onBlur={() => setTimeout(() => setDestinationSuggestions([]), 300)}
              />
              {destinationSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-brand-gray-light rounded-xl mt-1 max-h-40 overflow-y-auto shadow-card">
                  {destinationSuggestions.map((item, index) => (
                    <li key={`dest-${index}-${item.place_id || index}`}
                      className="p-3 hover:bg-brand-dark/5 cursor-pointer text-sm transition-colors"
                      onClick={() => { setDestination(item.display_name); setDestinationCoords({ lat: Number(item.lat), lng: Number(item.lon) }); setDestinationSuggestions([]); cleanupRequests(); }}>
                      {item.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-32">
              <label className="block text-sm font-display font-semibold text-brand-dark mb-3">
                <Users className="h-3.5 w-3.5 inline mr-1" /> Seats
              </label>
              <input
                type="number" min="1" max="8" required className="input-modern"
                value={seats} onChange={(e) => setSeats(Math.min(8, Math.max(1, Number(e.target.value))))}
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="flex-1 sm:flex-none group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-dark text-white font-display font-bold rounded-full hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <div className="loader-spinner !w-4 !h-4 !border-2" />Searching...
                </span>
              ) : (
                <>Search <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>
        </form>
      </div>

      {searched && (
        <div>
          <h2 className="font-display text-lg font-bold text-brand-dark mb-6">Available Rides</h2>
          {searchResults.length === 0 ? (
            <div className="bg-white rounded-2xl border border-brand-gray-light p-16 text-center">
              <Search className="h-10 w-10 mx-auto text-brand-muted/30 mb-4" />
              <p className="text-brand-muted">No rides found matching your criteria.</p>
              <p className="text-sm text-brand-muted/60 mt-2">Try adjusting your search or selecting different locations.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((ride) => (
                <div key={ride._id} className="bg-white rounded-2xl border border-brand-gray-light p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 card-lift">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-brand-dark flex items-center justify-center text-white font-display font-bold">
                          {ride.driverId?.name?.charAt(0).toUpperCase() || 'D'}
                        </div>
                        <div>
                          <p className="font-display font-bold text-brand-dark text-sm">{ride.driverId?.name || 'Driver'}</p>
                          {ride.distanceToDriver && (
                            <p className="text-xs text-brand-muted flex items-center gap-1">
                              <Navigation className="h-3 w-3" /> {ride.distanceToDriver} km away
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-brand-muted">
                        <strong className="text-brand-dark font-display">{ride.seatsAvailable}</strong> seats left
                      </span>
                    </div>
                    <div className="ml-[56px] relative pl-5 border-l-2 border-brand-gray-light space-y-3">
                      <div className="relative">
                        <div className="absolute -left-[23px] h-3 w-3 rounded-full border-2 border-brand-accent bg-white" />
                        <p className="text-sm text-brand-dark">{ride.source?.name || 'Pickup location'}</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[23px] h-3 w-3 rounded-full border-2 border-red-400 bg-white" />
                        <p className="text-sm text-brand-dark">{ride.destination?.name || 'Dropoff location'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex flex-col items-end gap-3 border-t md:border-t-0 md:border-l border-brand-gray-light pt-4 md:pt-0 md:pl-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-brand-accent" />
                      <div className="text-right">
                        <p className="font-display font-bold text-brand-dark">
                          {ride.departureTime ? format(new Date(ride.departureTime), 'MMM d, yyyy') : 'Date TBD'}
                        </p>
                        <p className="text-xs text-brand-muted">
                          {ride.departureTime ? format(new Date(ride.departureTime), 'h:mm a') : 'Time TBD'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => requestRide(ride._id)}
                      className="w-full md:w-auto px-6 py-3 bg-brand-dark text-white rounded-full text-sm font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all duration-500"
                    >
                      Request Ride
                    </button>
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