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
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Loader } from './components/Loader';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) return <Navigate to="/login" />;

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
          <Navbar />

          <main className="flex-1 pt-20">
            <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

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