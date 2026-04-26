import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ButtonLoader } from '../components/ButtonLoader';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAlert } from '../components/CustomAlert';
import { useLocationSearch } from '../lib/useLocationSearch';
import { LocationInput } from '../components/LocationInput';
import { MapPin, Users, Calendar, Search, Navigation, ArrowRight, Wifi, Clock, MapPinOff, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export const BookRide = () => {
  const { toast, showAlert, success: showSuccess } = useAlert();
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null); // tracks which ride button is in loading state
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  // Dynamic searching phase: 'searching' → animated wait, 'no-results' → final message
  const [searchPhase, setSearchPhase] = useState(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchMessageIdx, setSearchMessageIdx] = useState(0);
  const searchTimerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const messageTimerRef = useRef(null);
  const [userCoins, setUserCoins] = useState(null);
  const navigate = useNavigate();

  // Each field gets its own isolated hook instance — no cross-field interference
  const source = useLocationSearch();
  const destination = useLocationSearch();

  const SEARCH_MESSAGES = [
    'Scanning nearby drivers in your area…',
    'Checking available routes…',
    'Matching you with the best ride…',
    'Almost there, hold tight…',
    'Expanding search radius…',
  ];
  const SEARCH_DURATION = 7000; // 7 seconds

  // Fetch current user coin balance for the balance banner and affordability preview
  useEffect(() => {
    api.get('/auth/me').then(res => setUserCoins(res.data.coins ?? 0)).catch(() => {});
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (messageTimerRef.current) clearInterval(messageTimerRef.current);
    };
  }, []);

  // Start the simulated search animation phase
  const startSearchingPhase = useCallback(() => {
    setSearchPhase('searching');
    setSearchProgress(0);
    setSearchMessageIdx(0);

    // Progress bar: increment smoothly over SEARCH_DURATION
    const progressStep = 50; // update every 50ms
    const totalSteps = SEARCH_DURATION / progressStep;
    let currentStep = 0;
    progressTimerRef.current = setInterval(() => {
      currentStep++;
      // Ease-out curve for more natural feel
      const linear = currentStep / totalSteps;
      const eased = 1 - Math.pow(1 - linear, 2);
      setSearchProgress(Math.min(eased * 100, 98));
      if (currentStep >= totalSteps) clearInterval(progressTimerRef.current);
    }, progressStep);

    // Cycle through search messages
    messageTimerRef.current = setInterval(() => {
      setSearchMessageIdx(prev => (prev + 1) % SEARCH_MESSAGES.length);
    }, 1800);

    // After duration, reveal final result
    searchTimerRef.current = setTimeout(() => {
      clearInterval(progressTimerRef.current);
      clearInterval(messageTimerRef.current);
      setSearchProgress(100);
      // Short pause at 100% before showing result
      setTimeout(() => {
        setSearchPhase('no-results');
      }, 400);
    }, SEARCH_DURATION);
  }, [SEARCH_MESSAGES.length]);

  /**
   * Calculates the estimated ride cost using Haversine formula:
   * cost = ceil(distance_km * 2), minimum 1 coin
   */
  const getEstimatedCost = () => {
    if (!source.coords || !destination.coords) return null;
    const toRad = (d) => (d * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(destination.coords.lat - source.coords.lat);
    const dLon = toRad(destination.coords.lng - source.coords.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(source.coords.lat)) *
        Math.cos(toRad(destination.coords.lat)) *
        Math.sin(dLon / 2) ** 2;
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(1, Math.ceil(dist * 2));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      // If user typed a location but didn't pick from suggestions, geocode it now
      let srcCoords = source.coords;
      let destCoords = destination.coords;

      if (!srcCoords && source.query.trim()) {
        srcCoords = await source.geocodeQuery();
      }
      if (!destCoords && destination.query.trim()) {
        destCoords = await destination.geocodeQuery();
      }

      if (!srcCoords || !destCoords) {
        setError(!srcCoords && !destCoords
          ? "We couldn't resolve your locations. Please select from suggestions or try different names."
          : !srcCoords
            ? "We couldn't find your pickup location. Please select from suggestions or try a different name."
            : "We couldn't find your destination. Please select from suggestions or try a different name."
        );
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
          sourceLat: srcCoords.lat, sourceLng: srcCoords.lng,
          destLat: destCoords.lat, destLng: destCoords.lng, seats
        },
        timeout: 15000
      });
      setSearchResults(res.data);
      setLoading(false);
      if (res.data.length === 0) {
        // Don't show error immediately — enter the searching animation phase
        startSearchingPhase();
      } else {
        setSearchPhase(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.');
      setSearchResults([]);
      setSearchPhase(null);
      setLoading(false);
    }
  };

  const requestRide = async (offerId) => {
    if (!source.coords || !destination.coords) {
      toast('warning', 'Please select valid locations from suggestions');
      return;
    }
    setBookingId(offerId);
    try {
      await api.post('/requests', {
        offerId,
        seatsRequested: seats,
        source: { name: source.query, lat: source.coords.lat, lng: source.coords.lng },
        destination: { name: destination.query, lat: destination.coords.lat, lng: destination.coords.lng },
      });
      showSuccess('Ride requested! Coins have been deducted. Check your dashboard for updates.', 'Request Sent 🚗');
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.insufficientCoins) {
        // Show a rich blocking modal for insufficient coins, with an option to top up
        const confirmed = await showAlert({
          variant: 'warning',
          title: '💰 Not Enough Coins!',
          message: `You need ${data.coinsRequired} coins to book this ${data.distanceKm} km ride (2 coins/km), but you only have ${data.coinsAvailable} coins.\n\nPlease add more coins from your Profile page to continue.`,
          confirmText: 'Add Coins →',
          cancelText: 'Maybe Later',
        });
        if (confirmed) navigate('/profile');
      } else {
        toast('error', data?.message || 'Failed to request ride');
      }
    } finally {
      setBookingId(null);
    }
  };

  const estimatedCost = getEstimatedCost();

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 lg:py-8">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-2 flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-dark rounded-2xl flex items-center justify-center">
            <Search className="h-5 w-5 text-brand-accent" />
          </div>
          Find a Ride
        </h1>
        <p className="text-brand-muted ml-[60px]">Search for available rides on your route</p>
      </div>

      {/* Coin balance banner */}
      {userCoins !== null && (
        <div className="mb-6 flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm">
          <span className="text-amber-800 font-medium flex items-center gap-2">
            <span className="text-lg">🪙</span>
            Your balance: <strong>{userCoins} coins</strong>
            {estimatedCost !== null && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                userCoins >= estimatedCost
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              }`}>
                {userCoins >= estimatedCost ? `✓ Can afford (~${estimatedCost} coins)` : `Need ${estimatedCost - userCoins} more coins`}
              </span>
            )}
          </span>
          <span className="text-amber-600 text-xs">Rides cost 2 coins/km</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-brand-gray-light p-6 md:p-8 mb-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LocationInput
              field={source}
              id="book-source"
              label="Leaving from"
              placeholder="Type a city, village or landmark..."
              icon={MapPin}
              iconColor="text-brand-accent"
              showCurrentLocation={true}
            />
            <LocationInput
              field={destination}
              id="book-destination"
              label="Going to"
              placeholder="Type your destination..."
              icon={MapPin}
              iconColor="text-red-400"
            />
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
                  <ButtonLoader text="Searching..." />
                </span>
              ) : (
                <>Search <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Dynamic Searching Phase ── */}
      {searchPhase === 'searching' && (
        <div className="ride-search-phase-enter">
          <div className="bg-white rounded-2xl border border-brand-gray-light p-10 md:p-14 text-center relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-blue-50/40 ride-search-bg-sweep" />

            <div className="relative z-10">
              {/* Radar / pulse animation */}
              <div className="mx-auto mb-8 relative w-28 h-28">
                <div className="absolute inset-0 rounded-full border-2 border-brand-accent/20 ride-search-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-brand-accent/15 ride-search-ping" style={{ animationDelay: '0.4s' }} />
                <div className="absolute inset-4 rounded-full border-2 border-brand-accent/10 ride-search-ping" style={{ animationDelay: '0.8s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-dark flex items-center justify-center ride-search-icon-pulse">
                    <Navigation className="h-6 w-6 text-brand-accent ride-search-rotate" />
                  </div>
                </div>
              </div>

              {/* Main message */}
              <h3 className="font-display text-xl font-bold text-brand-dark mb-2">
                Searching for the best ride for you
              </h3>
              <p className="text-brand-muted text-sm mb-6 flex items-center justify-center gap-2">
                <Wifi className="h-4 w-4 text-brand-accent animate-pulse" />
                Please stay connected…
              </p>

              {/* Cycling status messages */}
              <div className="h-6 mb-6 overflow-hidden">
                <p key={searchMessageIdx} className="text-sm text-brand-accent font-display font-semibold ride-search-message-fade">
                  {SEARCH_MESSAGES[searchMessageIdx]}
                </p>
              </div>

              {/* Progress bar */}
              <div className="max-w-xs mx-auto">
                <div className="h-1.5 bg-brand-gray-light rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-accent to-amber-400 transition-all duration-200 ease-out ride-search-progress-glow"
                    style={{ width: `${searchProgress}%` }}
                  />
                </div>
                <p className="text-xs text-brand-muted/60 mt-2">
                  {Math.round(searchProgress)}% complete
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── No Results (after search animation completes) ── */}
      {searchPhase === 'no-results' && (
        <div className="ride-search-phase-enter">
          <div className="bg-white rounded-2xl border border-brand-gray-light p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-red-50/30 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center ride-search-result-pop">
                <MapPinOff className="h-7 w-7 text-red-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-brand-dark mb-2">
                No active rides available
              </h3>
              <p className="text-brand-muted text-sm mb-6 max-w-sm mx-auto">
                No active rides are currently available in this location. New rides are added frequently — try again soon!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={(e) => { setSearchPhase(null); setSearched(false); setError(''); handleSearch(e); }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-full text-sm font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all duration-500"
                >
                  <RefreshCw className="h-4 w-4" /> Search Again
                </button>
                <button
                  onClick={() => navigate('/offer-ride')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-brand-gray-light text-brand-dark rounded-full text-sm font-display font-bold hover:border-brand-accent transition-all duration-300"
                >
                  Offer a Ride Instead
                </button>
              </div>
              <div className="mt-8 pt-6 border-t border-brand-gray-light">
                <p className="text-xs text-brand-muted/60 flex items-center justify-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Tip: Try different times or nearby locations for more results
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {searched && searchPhase === null && (
        <div>
          <h2 className="font-display text-lg font-bold text-brand-dark mb-6">Available Rides</h2>
          {searchResults.length === 0 && !loading ? null : searchResults.length === 0 ? (
            <div className="bg-white rounded-2xl border border-brand-gray-light p-16 text-center">
              <Search className="h-10 w-10 mx-auto text-brand-muted/30 mb-4" />
              <p className="text-brand-muted">No rides found matching your criteria.</p>
              <p className="text-sm text-brand-muted/60 mt-2">Try adjusting your search or selecting different locations.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((ride) => {
                const cost = estimatedCost;
                const canAfford = userCoins === null || cost === null || userCoins >= cost;
                return (
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
                      {/* Coin cost badge */}
                      {cost !== null && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          canAfford
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                          🪙 ~{cost} coins
                          {!canAfford && <span className="font-normal ml-1">(need more)</span>}
                        </div>
                      )}
                      <button
                        onClick={() => requestRide(ride._id)}
                        disabled={bookingId === ride._id}
                        className="w-full md:w-auto px-6 py-3 bg-brand-dark text-white rounded-full text-sm font-display font-bold hover:bg-brand-accent hover:text-brand-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {bookingId === ride._id ? (
                          <span className="inline-flex items-center gap-2">
                            <ButtonLoader text="Booking..." />
                          </span>
                        ) : 'Request Ride'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};