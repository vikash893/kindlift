import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight">Kindlift</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/offer-ride" className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium transition-colors">Offer Ride</Link>
                <Link to="/book-ride" className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium transition-colors">Book Ride</Link>
                <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium transition-colors">Dashboard</Link>
                <div className="flex items-center space-x-2 ml-4 border-l border-blue-400 pl-4">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-blue-100 border border-blue-300 flex items-center justify-center">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <span className="font-medium">{user.name}</span>
                  <button onClick={handleLogout} className="ml-2 hover:text-red-200 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};