import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { OfferRide } from './pages/OfferRide';
import { BookRide } from './pages/BookRide';
import { RideDetails } from './pages/RideDetails';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />

          <main className="flex-1">
            <Routes>

              <Route path="/" element={<Navigate to="/dashboard" />} />

              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/offer-ride"
                element={
                  <PrivateRoute>
                    <OfferRide />
                  </PrivateRoute>
                }
              />

              <Route
                path="/book-ride"
                element={
                  <PrivateRoute>
                    <BookRide />
                  </PrivateRoute>
                }
              />

              <Route
                path="/ride/:id"
                element={
                  <PrivateRoute>
                    <RideDetails />
                  </PrivateRoute>
                }
              />

            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;