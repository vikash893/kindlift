import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AlertProvider } from './components/CustomAlert';
import { Navbar } from './components/Navbar';
import { Loader } from './components/Loader';
import ScrollToTop from './components/ScrollToTop';

// ─── Lazy-loaded Pages (Code Splitting) ─────────────
// Each page is only loaded when the user navigates to it,
// reducing the initial JS bundle size dramatically.
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const OfferRide = lazy(() => import('./pages/OfferRide').then(m => ({ default: m.OfferRide })));
const BookRide = lazy(() => import('./pages/BookRide').then(m => ({ default: m.BookRide })));
const RideDetails = lazy(() => import('./pages/RideDetails').then(m => ({ default: m.RideDetails })));
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const AdminPanel = lazy(() => import('./pages/AdminPanel').then(m => ({ default: m.AdminPanel })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then(m => ({ default: m.TermsOfService })));
const Safety = lazy(() => import('./pages/Safety').then(m => ({ default: m.Safety })));
const FAQs = lazy(() => import('./pages/FAQs').then(m => ({ default: m.FAQs })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const Feedback = lazy(() => import('./pages/Feedback'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const Friends = lazy(() => import('./pages/Friends').then(m => ({ default: m.Friends })));
const Messages = lazy(() => import('./pages/Messages').then(m => ({ default: m.Messages })));
const UserProfile = lazy(() => import('./pages/UserProfile').then(m => ({ default: m.UserProfile })));

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

/* Hide navbar on login/register pages */
const ConditionalNavbar = () => {
  const location = useLocation();
  const hideOn = ['/login', '/register', '/forgot-password'];
  if (hideOn.includes(location.pathname)) return null;
  return <Navbar />;
};

function App() {
  return (<AuthProvider> <AlertProvider> <Router> <ScrollToTop /> <div className="min-h-screen bg-brand-light flex flex-col font-sans"> <NotificationProvider> <ConditionalNavbar />      <main className="flex-1">
    <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/safety" element={<Safety />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/feedback" element={<Feedback />} />

      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />

      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      <Route path="/offer-ride" element={
        <PrivateRoute>
          <OfferRide />
        </PrivateRoute>
      } />

      <Route path="/book-ride" element={
        <PrivateRoute>
          <BookRide />
        </PrivateRoute>
      } />

      <Route path="/ride/:id" element={
        <PrivateRoute>
          <RideDetails />
        </PrivateRoute>
      } />

      <Route path="/admin" element={
        <PrivateRoute>
          <AdminPanel />
        </PrivateRoute>
      } />

      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />

      <Route path="/friends" element={
        <PrivateRoute>
          <Friends />
        </PrivateRoute>
      } />

      <Route path="/messages" element={
        <PrivateRoute>
          <Messages />
        </PrivateRoute>
      } />

      <Route path="/messages/:userId" element={
        <PrivateRoute>
          <Messages />
        </PrivateRoute>
      } />

      <Route path="/user/:userId" element={
        <PrivateRoute>
          <UserProfile />
        </PrivateRoute>
      } />

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  </main>
  </NotificationProvider>
  </div>
  </Router>
  </AlertProvider>
  </AuthProvider>

  );
}

export default App;
