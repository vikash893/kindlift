import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { MapPin, Users, Calendar, Search, Navigation, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useRef } from 'react';

export const BookRide = () => {
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

  const fetchLocationSuggestions = (query, type) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (!query || query.length < 3) return;

      try {
        const res = await api.get(`/location/search?q=${query}`);

        if (type === "source") {
          setSourceSuggestions(res.data);
        } else {
          setDestinationSuggestions(res.data);
        }
      } catch (err) {
        console.log("API ERROR:", err.response?.data || err.message);
      }
    }, 400);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      if (!sourceCoords || !destinationCoords) {
        setError("Please select locations from suggestions");
        setLoading(false);
        return;
      }
      const res = await api.get('/rides/search', {
        params: {
          sourceLat: sourceCoords.lat,
          sourceLng: sourceCoords.lng,
          destLat: destinationCoords.lat,
          destLng: destinationCoords.lng,
          seats
        }
      });
      setSearchResults(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const requestRide = async (offerId) => {
    try {
      await api.post('/requests', {
        offerId,
        seatsRequested: seats,
        source: {
          name: source,
          lat: sourceCoords.lat,
          lng: sourceCoords.lng
        },
        destination: {
          name: destination,
          lat: destinationCoords.lat,
          lng: destinationCoords.lng
        },
      });
      alert('Ride requested successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request ride');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search Card */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 md:p-8 mb-8">
        <h1 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center">
            <Search className="h-5 w-5 text-brand-accent" />
          </div>
          Find a Ride
        </h1>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-brand-accent" />
            </div>
            <input
              type="text"
              required
              className="pl-11 block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
              placeholder="Leaving from..."
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setSourceCoords(null); // 🔥 MUST
                fetchLocationSuggestions(e.target.value, "source");
              }}
              onBlur={() => setTimeout(() => setSourceSuggestions([]), 300)}
            />
            {sourceSuggestions.length > 0 && (
              <ul className="absolute top-full left-0 z-20 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow">
                {sourceSuggestions.map((item, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setSource(item.display_name);
                      setSourceCoords({
                        lat: Number(item.lat),
                        lng: Number(item.lon),
                      });
                      setSourceSuggestions([]);
                    }}
                  >
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-red-400" />
            </div>
            <input
              type="text"
              required
              className="pl-11 block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
              placeholder="Going to..."
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setDestinationCoords(null); // 🔥 IMPORTANT FIX
                fetchLocationSuggestions(e.target.value, "destination");
              }}
              onBlur={() => setTimeout(() => setDestinationSuggestions([]), 200)}
            />
            {destinationSuggestions.length > 0 && (
              <ul className="absolute top-full left-0 z-20 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow">
                {destinationSuggestions.map((item, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setDestination(item.display_name);
                      setDestinationCoords({
                        lat: Number(item.lat),
                        lng: Number(item.lon),
                      });
                      setDestinationSuggestions([]);
                    }}
                  >
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="w-full md:w-28 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Users className="h-4 w-4 text-brand-muted" />
            </div>
            <input
              type="number"
              min="1"
              max="8"
              required
              className="pl-11 block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-all outline-none bg-brand-cream/50"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-brand-dark text-white rounded-xl text-sm font-semibold hover:bg-brand-charcoal transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <div className="loader-spinner !w-4 !h-4 !border-2" />
                Searching...
              </span>
            ) : (
              <>
                Search
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <h2 className="text-lg font-semibold text-brand-dark mb-4">Available Rides</h2>
          {searchResults.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-10 text-center">
              <Search className="h-10 w-10 mx-auto text-brand-muted/40 mb-3" />
              <p className="text-brand-muted">No rides found matching your criteria.</p>
              <p className="text-sm text-brand-muted/60 mt-1">Try adjusting your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((ride) => (
                <div
                  key={ride._id}
                  className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6 card-lift"
                >
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-brand-cream flex items-center justify-center text-brand-dark font-bold text-sm border border-gray-100">
                          {ride.driverId.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-dark text-sm">{ride.driverId.name}</p>
                          <p className="text-xs text-brand-muted flex items-center gap-1">
                            <Navigation className="h-3 w-3" /> {ride.distanceToDriver} km away
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-brand-muted">
                          <span className="font-bold text-brand-dark">{ride.seatsAvailable}</span> seats left
                        </p>
                      </div>
                    </div>

                    <div className="ml-12 relative pl-4 border-l-2 border-gray-100 space-y-3">
                      <div className="relative">
                        <div className="absolute -left-[21px] h-3 w-3 rounded-full border-2 border-brand-accent bg-white" />
                        <p className="text-sm text-brand-dark">{ride.source.name}</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[21px] h-3 w-3 rounded-full border-2 border-red-400 bg-white" />
                        <p className="text-sm text-brand-dark">{ride.destination.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex flex-col items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-brand-accent" />
                      <div className="text-right">
                        <p className="font-semibold text-brand-dark">{format(new Date(ride.departureTime), 'MMM d, yyyy')}</p>
                        <p className="text-xs text-brand-muted">{format(new Date(ride.departureTime), 'h:mm a')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => requestRide(ride._id)}
                      className="w-full md:w-auto px-6 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-semibold hover:bg-brand-charcoal transition-all"
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