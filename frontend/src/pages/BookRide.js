import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { MapPin, Users, Calendar, Search, Navigation } from 'lucide-react';
import { format } from 'date-fns';

export const BookRide = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await api.get('/rides/search', {
        params: { source, destination, seats }
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
        source: { name: source, lat: 0, lng: 0 },
        destination: { name: destination, lat: 0, lng: 0 }
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
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Search className="h-6 w-6 mr-2 text-blue-600" /> Find a Ride
        </h1>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm p-3"
                placeholder="Leaving from..."
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm p-3"
                placeholder="Going to..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-32">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="1"
                max="8"
                required
                className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm p-3"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              'Search'
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {searched && (
        <div className="animate-fade-in-up">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Rides</h2>
          {searchResults.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p>No rides found matching your criteria.</p>
              <p className="text-sm mt-1">Try adjusting your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map(ride => (
                <div 
                  key={ride._id} 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center hover:border-blue-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-1 w-full mb-4 md:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-sm">
                          {ride.driverId.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{ride.driverId.name}</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Navigation className="h-3 w-3 mr-1" /> {ride.distanceToDriver} km away
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 flex items-center justify-end">
                          <Users className="h-4 w-4 mr-1 text-gray-400" /> 
                          <span className="text-blue-600 font-bold">{ride.seatsAvailable}</span> seats left
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pl-12 relative">
                      <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                      <div className="relative flex items-center mb-4">
                        <div className="absolute -left-[33px] h-3 w-3 rounded-full border-2 border-blue-500 bg-white shadow-sm"></div>
                        <p className="text-sm font-medium text-gray-700">{ride.source.name}</p>
                      </div>
                      <div className="relative flex items-center">
                        <div className="absolute -left-[33px] h-3 w-3 rounded-full border-2 border-red-500 bg-white shadow-sm"></div>
                        <p className="text-sm font-medium text-gray-700">{ride.destination.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto md:ml-6 flex flex-col items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    <div className="flex items-center text-gray-700 mb-4">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{format(new Date(ride.departureTime), 'MMM d, yyyy')}</p>
                        <p className="text-sm text-gray-500">{format(new Date(ride.departureTime), 'h:mm a')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => requestRide(ride._id)}
                      className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg"
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