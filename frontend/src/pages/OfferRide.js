import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { MapPin, Users, Calendar, Clock, Save, FileText, Hash, Camera, XCircle } from 'lucide-react';

export const OfferRide = () => {
  const location = useLocation();
  const { user, updateUser } = useAuth();

  const [source, setSource] = useState(location.state?.source || '');
  const [destination, setDestination] = useState(location.state?.destination || '');
  const [seats, setSeats] = useState(location.state?.seats || 3);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [saveRoute, setSaveRoute] = useState(false);

  // Driver verification fields
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehiclePhoto, setVehiclePhoto] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setVehiclePhoto(reader.result);
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const departureTime = new Date(`${date}T${time}`).toISOString();

      const payload = {
        sourceName: source,
        destinationName: destination,
        seatsAvailable: seats,
        departureTime
      };

      if (!user?.isDriverVerified) {
        if (!vehicleNumber || !licenseNumber || !vehiclePhoto) {
          setError('Please provide all verification details');
          setLoading(false);
          return;
        }
        payload.vehicleNumber = vehicleNumber;
        payload.licenseNumber = licenseNumber;
        payload.vehiclePhoto = vehiclePhoto;
      }

      await api.post('/rides', payload);

      if (!user?.isDriverVerified) {
        updateUser({ isDriverVerified: true });
      }

      if (saveRoute) {
        await api.post('/saved-rides', {
          sourceName: source,
          destinationName: destination,
          seats
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ride offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6 flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-600" />
          Offer a Ride
        </h1>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* SOURCE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leaving from
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                <input
                  type="text"
                  required
                  className="pl-10 w-full border-2 border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter pickup location"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
            </div>

            {/* DESTINATION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Going to
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-red-500" />
                <input
                  type="text"
                  required
                  className="pl-10 w-full border-2 border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            {/* DATE + TIME */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full border-2 border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Time
                </label>
                <input
                  type="time"
                  required
                  className="w-full border-2 border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            {/* SEATS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Available Seats
              </label>
              <input
                type="number"
                min="1"
                max="8"
                required
                className="w-full border-2 border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
              />
            </div>

            {/* SAVE ROUTE */}
            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="saveRoute"
                checked={saveRoute}
                onChange={(e) => setSaveRoute(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="saveRoute" className="text-sm text-gray-700 cursor-pointer flex items-center">
                <Save className="h-4 w-4 mr-1 text-gray-500" />
                Save this route for future rides
              </label>
            </div>

            {/* DRIVER VERIFICATION SECTION */}
            {!user?.isDriverVerified && (
              <div className="border-t border-gray-200 pt-6 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Driver Verification
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Since you're offering a ride for the first time, please provide your vehicle details.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Hash className="h-4 w-4 inline mr-1" />
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., KA 01 AB 1234"
                      className="w-full border-2 border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="h-4 w-4 inline mr-1" />
                      License Number
                    </label>
                    <input
                      type="text"
                      placeholder="Driver's license number"
                      className="w-full border-2 border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Camera className="h-4 w-4 inline mr-1" />
                      Vehicle Photo
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors duration-200">
                          <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click to upload vehicle photo</p>
                          <p className="text-xs text-gray-500">Max size 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                      {photoPreview && (
                        <div className="relative">
                          <img
                            src={photoPreview}
                            alt="Vehicle preview"
                            className="h-24 w-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setVehiclePhoto('');
                              setPhotoPreview('');
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </span>
            ) : (
              'Publish Ride'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};