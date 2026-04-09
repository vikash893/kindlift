# KindLift Frontend

React 19 single-page application for the KindLift ride-sharing platform.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open on `http://localhost:3000`.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| React Router v7 | Client-side routing with protected routes |
| Tailwind CSS 3.4 | Utility-first styling |
| Three.js / React Three Fiber | 3D hero section |
| Leaflet / React Leaflet | Interactive maps |
| Socket.IO Client | Real-time messaging |
| Axios | HTTP client with JWT auth interceptor |
| Lucide React | Icon library |
| date-fns | Date formatting |

## Project Structure

```
src/
├── api/
│   └── axios.js            # Legacy axios instance (deprecated, use lib/api.js)
├── auth/                    # Auth-related utilities
├── components/
│   ├── CustomCursor.js      # Cuberto-style animated cursor effect
│   ├── Footer.js            # Global footer with quick links
│   ├── HeroCar3D.js         # Three.js 3D car hero with React Three Fiber
│   ├── Loader.js            # Animated loading spinner
│   ├── MagneticButton.js    # Magnetic hover effect button
│   ├── MarqueeText.js       # Auto-scrolling marquee text animation
│   ├── Navbar.js            # Responsive navigation bar with mobile menu
│   └── TextReveal.js        # Scroll-triggered text reveal animation
├── context/
│   └── AuthContext.js       # Global auth state (user, token, login/logout)
├── lib/
│   ├── api.js               # Axios instance with JWT interceptor (primary)
│   └── socket.js            # Socket.IO client configuration
├── pages/
│   ├── Home.js              # Landing page with 3D hero and features
│   ├── About.js             # About KindLift page
│   ├── Contact.js           # Contact form page
│   ├── Login.js             # Login page with email/password
│   ├── Register.js          # Registration with OTP email verification
│   ├── Dashboard.js         # User dashboard (offers, requests, stats)
│   ├── OfferRide.js         # Create ride offer with Leaflet map
│   ├── BookRide.js          # Search and book available rides
│   └── RideDetails.js       # Ride details with map, chat, and completion
├── App.js                   # Root component with routing configuration
├── App.css                  # Global app styles
├── index.js                 # React entry point
└── index.css                # Tailwind CSS directives and custom styles
```

## Page Routes

| Path | Component | Auth | Description |
|------|-----------|------|-------------|
| `/` | Home | ❌ | Landing page with 3D hero |
| `/about` | About | ❌ | About page |
| `/contact` | Contact | ❌ | Contact form |
| `/login` | Login | 🔄 Public only | Login form |
| `/register` | Register | 🔄 Public only | Registration with OTP |
| `/dashboard` | Dashboard | ✅ Required | User dashboard |
| `/offer-ride` | OfferRide | ✅ Required | Create ride offer |
| `/book-ride` | BookRide | ✅ Required | Search & book rides |
| `/ride/:id` | RideDetails | ✅ Required | Ride details & chat |

**Legend:** ❌ = No auth needed, 🔄 = Redirects to dashboard if logged in, ✅ = Redirects to login if not authenticated

## Key Design Features

- **Custom Cuberto-style cursor** — Premium animated cursor effect
- **3D Three.js hero** — Interactive car model on landing page
- **Leaflet maps** — Interactive maps for ride source/destination selection
- **Real-time chat** — Socket.IO-powered messaging between driver and passenger
- **Responsive design** — Mobile-first approach with Tailwind CSS
- **Route protection** — PrivateRoute and PublicRoute wrappers for auth flows

## Environment Configuration

The API base URL is configured in `src/lib/api.js`:

```javascript
const api = axios.create({
  baseURL: 'https://kindlift-1.onrender.com/api',
});
```

For local development, change this to:
```javascript
baseURL: 'http://localhost:8000/api'
```

Also update Socket.IO URL in `src/lib/socket.js`:
```javascript
export const socket = io('http://localhost:8000', { ... });
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 3000 |
| `npm run build` | Build production bundle to `build/` |
| `npm test` | Run test suite |
| `npm run eject` | Eject from Create React App (irreversible) |
