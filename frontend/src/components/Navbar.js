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
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-blue-200 font-medium transition-colors">About</Link>
            <Link to="/contact" className="hover:text-blue-200 font-medium transition-colors">Contact</Link>
            {user ? (
              <>
                <Link to="/offer-ride" className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium transition-colors">Offer Ride</Link>
                <Link to="/book-ride" className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium transition-colors">Book Ride</Link>
                <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium transition-colors">Dashboard</Link>
                <div className="flex items-center space-x-3 ml-4 border-l border-blue-400 pl-4 bg-blue-700/50 rounded-lg pr-3 py-1">
                  <div className="flex flex-col items-end mr-2 text-xs">
                    <span className="text-yellow-300 font-bold flex items-center">🟡 {user.coins || 0}</span>
                    <span className="text-gray-100 flex items-center">⭐ {user.totalRatings > 0 ? (user.ratingSum / user.totalRatings).toFixed(1) : 'New'}</span>
                  </div>
                  <div className="h-9 w-9 rounded-full overflow-hidden bg-white border-2 border-yellow-400 flex items-center justify-center">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <span className="font-bold text-sm hidden sm:block">{user.name.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="ml-1 hover:text-red-300 transition-colors bg-red-500/20 p-1.5 rounded-full">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 px-5 py-2 rounded-full font-bold shadow-md transition-all hover:-translate-y-0.5">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};