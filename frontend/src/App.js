import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { OfferRide } from './pages/OfferRide';
import { BookRide } from './pages/BookRide';
import { RideDetails } from './pages/RideDetails';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AdminPanel } from './pages/AdminPanel';
import { Profile } from './pages/Profile';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { Safety } from './pages/Safety';
import { FAQs } from './pages/FAQs';
import { Loader } from './components/Loader';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return !user ? children : <Navigate to="/dashboard" />;
};

/* Hide navbar on login/register pages (they have their own branding) */
const ConditionalNavbar = () => {
  const location = useLocation();
  const hideOn = ['/login', '/register'];
  if (hideOn.includes(location.pathname)) return null;
  return <Navbar />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-brand-light flex flex-col font-sans">
          <CustomCursor />
          <ConditionalNavbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/offer-ride" element={<PrivateRoute><OfferRide /></PrivateRoute>} />
              <Route path="/book-ride" element={<PrivateRoute><BookRide /></PrivateRoute>} />
              <Route path="/ride/:id" element={<PrivateRoute><RideDetails /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;