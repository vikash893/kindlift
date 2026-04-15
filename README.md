# 🚗 KindLift — Personalized Travel Companion Platform

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A modern ride-sharing web application that connects solo travelers with vehicle owners for safe, shared journeys.**

[Live Demo](https://kindlift.onrender.com) · [Report Bug](https://github.com/vikash893/kindlift/issues) · [Request Feature](https://github.com/vikash893/kindlift/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Models](#-database-models)
- [Real-Time Events](#-real-time-events-socketio)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🌟 About the Project

**KindLift** solves the problem of solo travelers feeling isolated by connecting them to others and providing shared ride opportunities. Whether you're a driver with empty seats or a passenger looking for a convenient ride, KindLift matches you with compatible companions based on route proximity.

### Problem Statement

> Personalized travel-companion app that connects people traveling alone with vehicles, promoting safe and affordable shared transportation.

### Value Proposition

- 🎯 **Route Matching** — Smart proximity-based ride matching using the Haversine formula (5 km radius)
- 💬 **Real-Time Chat** — Instant messaging between drivers and passengers via Socket.IO
- 🔒 **Secure Completion** — 4-digit OTP codes ensure verified ride completion
- 🪙 **Coin Rewards** — Gamified incentive system rewarding both drivers and passengers
- ⭐ **Rating System** — Mutual driver/passenger ratings build trust and accountability

---

## ✨ Key Features

### For Drivers
| Feature | Description |
|---------|-------------|
| **Offer Rides** | Create ride offers with source, destination, seats, and departure time |
| **Driver Verification** | One-time vehicle + license verification on first ride creation |
| **Manage Requests** | Accept or reject incoming ride requests from passengers            |
| **Complete Rides** | Verify ride completion using passenger's 4-digit OTP code           |
| **Earn Coins** | Receive coins based on distance covered (1 coin per km)                 |

### For Passengers
| Feature | Description |
|---------|-------------|
| **Search Rides** | Find matching rides based on source/destination coordinates           |
| **Book Rides** | Request seats on available rides with real-time notifications           |
| **Real-Time Chat** | Message drivers in real-time after booking                          |
| **Rate Drivers** | Leave 1-5 star ratings with text reviews post-ride                    |
| **Save Routes** | Bookmark frequently used routes for quick access                       |

### General
| Feature | Description |
|---------|-------------|
| **OTP Email Verification** | Email-based OTP verification during registration             |
| **Interactive Maps** | Leaflet-powered maps for location selection and ride visualization |
| **3D Hero Section** | Immersive Three.js-powered landing page with animated car model     |
| **Responsive Design** | Fully responsive UI with mobile-first approach                    |
| **Custom Cursor** | Cuberto-style custom cursor for premium feel                          |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with functional components and hooks |
| **React Router v7** | Client-side routing with protected routes |
| **Tailwind CSS 3.4** | Utility-first CSS framework for styling |
| **Three.js / React Three Fiber** | 3D hero section with animated car model |
| **Leaflet / React Leaflet** | Interactive maps for ride location display |
| **Socket.IO Client** | Real-time messaging with WebSocket transport |
| **Axios** | HTTP client with auth interceptors |
| **Lucide React** | Modern icon library |
| **date-fns** | Date formatting utilities |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js 4** | REST API framework |
| **MongoDB + Mongoose** | NoSQL database with ODM |
| **Socket.IO 4.8** | Real-time bidirectional communication |
| **JWT (jsonwebtoken)** | Token-based authentication (7-day expiry) |
| **bcrypt.js** | Password hashing with salt rounds |
| **Nodemailer** | OTP email delivery via Gmail SMTP |
| **express-rate-limit** | API rate limiting (300 req/min global, 60 req/min location) |
| **node-cache** | In-memory caching for geocoding results (1 hour TTL) |
| **p-queue** | Request queuing for Nominatim API (1 req/sec) |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│  React 19 + Tailwind CSS + Three.js + Leaflet           │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Pages   │  │Components│  │ Context  │              │
│  │ (9 pages)│  │(8 comps) │  │(AuthCtx) │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │              │             │                     │
│  ┌────┴──────────────┴─────────────┴─────┐              │
│  │          lib/api.js (Axios)           │ ← JWT Token  │
│  │          lib/socket.js (Socket.IO)    │ ← WebSocket  │
│  └────────────────┬──────────────────────┘              │
└───────────────────┼─────────────────────────────────────┘
                    │ HTTPS / WSS
┌───────────────────┼─────────────────────────────────────┐
│                   ▼      BACKEND                        │
│  ┌────────────────────────────────────────┐              │
│  │         Express.js Server              │              │
│  │  ┌──────────────────────────────────┐  │              │
│  │  │     Middleware Layer             │  │              │
│  │  │  • CORS  • Rate Limiter  • Auth │  │              │
│  │  └──────────────────────────────────┘  │              │
│  │                                        │              │
│  │  ┌─────────┐  ┌─────────┐  ┌────────┐ │              │
│  │  │  Auth   │  │  Rides  │  │Location│ │              │
│  │  │ Routes  │  │ Routes  │  │ Routes │ │              │
│  │  └─────────┘  └─────────┘  └────────┘ │              │
│  │  ┌─────────┐  ┌─────────┐  ┌────────┐ │              │
│  │  │Requests │  │ Ratings │  │ Saved  │ │              │
│  │  │ Routes  │  │ Routes  │  │ Rides  │ │              │
│  │  └─────────┘  └─────────┘  └────────┘ │              │
│  └────────────────┬───────────────────────┘              │
│                   │                                      │
│  ┌────────────────┼───────────────────────┐              │
│  │  Socket.IO     ▼    Server             │              │
│  │  • join room  • send_message           │              │
│  │  • receive_message  • request_updated  │              │
│  └────────────────┬───────────────────────┘              │
└───────────────────┼─────────────────────────────────────┘
                    │
┌───────────────────┼─────────────────────────────────────┐
│                   ▼    DATABASE                         │
│            MongoDB Atlas (Cloud)                        │
│  ┌────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐  │
│  │ Users  │ │RideOffers│ │RideRequests│ │ Messages  │  │
│  └────────┘ └──────────┘ └───────────┘ └───────────┘  │
│  ┌────────┐ ┌──────────┐                               │
│  │Ratings │ │SavedRides│                               │
│  └────────┘ └──────────┘                               │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
kindlift/
├── backend/                    # Express.js API server
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   ├── User.js             # User schema (auth, driver verification, coins, ratings)
│   │   ├── RideOffer.js        # Ride offer schema (source, destination, seats, status)
│   │   ├── RideRequest.js      # Ride request schema (passenger booking, OTP, rating flags)
│   │   ├── Message.js          # Chat message schema (linked to ride requests)
│   │   ├── Rating.js           # Rating schema (1-5 stars, reviews, duplicate prevention)
│   │   └── SavedRide.js        # Saved ride/route schema
│   ├── routes/
│   │   ├── auth.js             # Authentication routes (register, login, OTP, me)
│   │   ├── rides.js            # Ride management (create, search, my-offers, complete)
│   │   ├── requests.js         # Request handling (create, accept/reject, complete, messages)
│   │   ├── ratings.js          # Rating submission and retrieval
│   │   ├── savedRides.js       # Saved routes CRUD operations
│   │   └── location.js         # Location search with Nominatim geocoding
│   ├── utils/
│   │   ├── geocoder.js         # Geocoding + Haversine distance calculation
│   │   └── sendEmail.ts        # Nodemailer email utility
│   ├── uploads/                # File upload directory
│   ├── .env                    # Environment variables (not committed)
│   ├── server.js               # Application entry point
│   └── package.json            # Backend dependencies
│
├── frontend/                   # React SPA
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Legacy axios instance (deprecated)
│   │   ├── auth/               # Auth-related utilities
│   │   ├── components/
│   │   │   ├── CustomCursor.js # Cuberto-style animated cursor
│   │   │   ├── Footer.js       # Global footer component
│   │   │   ├── HeroCar3D.js    # Three.js 3D car hero section
│   │   │   ├── Loader.js       # Loading spinner component
│   │   │   ├── MagneticButton.js # Magnetic hover effect button
│   │   │   ├── MarqueeText.js  # Scrolling marquee text
│   │   │   ├── Navbar.js       # Responsive navigation bar
│   │   │   └── TextReveal.js   # Scroll-triggered text animation
│   │   ├── context/
│   │   │   └── AuthContext.js  # React Context for auth state management
│   │   ├── lib/
│   │   │   ├── api.js          # Axios instance with JWT interceptor
│   │   │   └── socket.js       # Socket.IO client configuration
│   │   ├── pages/
│   │   │   ├── Home.js         # Landing page with 3D hero
│   │   │   ├── About.js        # About page
│   │   │   ├── Contact.js      # Contact form page
│   │   │   ├── Login.js        # Login page
│   │   │   ├── Register.js     # Registration page with OTP verification
│   │   │   ├── Dashboard.js    # User dashboard (offers, requests, stats)
│   │   │   ├── OfferRide.js    # Create ride offer with map
│   │   │   ├── BookRide.js     # Search and book rides
│   │   │   └── RideDetails.js  # Ride details with chat and map
│   │   ├── App.js              # Root component with routing
│   │   ├── App.css             # Global app styles
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Tailwind CSS directives and custom styles
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   └── package.json            # Frontend dependencies
│
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **MongoDB Atlas** account — [Sign up](https://www.mongodb.com/atlas)
- **Gmail account** with App Password for OTP emails — [Guide](https://support.google.com/accounts/answer/185833)
- **Git** — [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vikash893/kindlift.git
   cd kindlift
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables** (see [Environment Variables](#-environment-variables))

5. **Start the backend server**

   ```bash
   cd backend
   node server.js
   ```

   The API server will start on `http://localhost:8000`

6. **Start the frontend development server**

   ```bash
   cd frontend
   npm start
   ```

   The React app will open on `http://localhost:3000`

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# ─── Database ───────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/kindlift?retryWrites=true&w=majority

# ─── Authentication ─────────────────────────────────
JWT_SECRET=your_secure_random_jwt_secret_key

# ─── Email (Gmail SMTP for OTP) ─────────────────────
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# ─── Server ─────────────────────────────────────────
PORT=8000
```

> **Note:** For Gmail, you must generate an **App Password** (not your regular password). Enable 2FA on your Google account first, then go to *Security → App Passwords → Generate*.

---

## 📡 API Documentation

**Base URL:** `https://kindlift-1.onrender.com/api`

All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

---

### 🔑 Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register a new user (requires verified email) |
| `POST` | `/login` | ❌ | Login and receive JWT token |
| `GET` | `/me` | ✅ | Get current authenticated user profile |
| `POST` | `/send-otp` | ❌ | Send OTP to email for verification |
| `POST` | `/verify-otp` | ❌ | Verify OTP code |

<details>
<summary><strong>POST /register</strong> — Register a new user</summary>

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "+91-9876543210",
  "profilePhoto": "data:image/jpeg;base64,..."
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60f7b2c...",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePhoto": "data:image/jpeg;base64,...",
    "isDriverVerified": false
  }
}
```

**Error (400):** `"User already exists"` or `"Email not verified ❌"`
</details>

<details>
<summary><strong>POST /login</strong> — Login</summary>

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60f7b2c...",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePhoto": "...",
    "isDriverVerified": true
  }
}
```
</details>

<details>
<summary><strong>POST /send-otp</strong> — Send OTP to email</summary>

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):** `{ "message": "OTP sent" }`
</details>

<details>
<summary><strong>POST /verify-otp</strong> — Verify OTP</summary>

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):** `{ "message": "Verified ✅" }`
</details>

---

### 🚗 Rides (`/api/rides`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Create a new ride offer |
| `GET` | `/my-offers` | ✅ | Get all rides offered by the current user |
| `GET` | `/search` | ✅ | Search for matching rides by coordinates |
| `PUT` | `/:id/complete` | ✅ | Complete a ride with OTP verification |

<details>
<summary><strong>POST /</strong> — Create a ride offer</summary>

**Request Body:**
```json
{
  "source": {
    "name": "Connaught Place, Delhi",
    "lat": 28.6315,
    "lng": 77.2167
  },
  "destination": {
    "name": "Sector 18, Noida",
    "lat": 28.5706,
    "lng": 77.3218
  },
  "seatsAvailable": 3,
  "departureTime": "2026-04-10T08:00:00.000Z",
  "vehicleNumber": "DL01AB1234",
  "licenseNumber": "DL-1234567890",
  "vehiclePhoto": "data:image/jpeg;base64,..."
}
```

> **Note:** `vehicleNumber`, `licenseNumber`, and `vehiclePhoto` are required only for first-time drivers.

**Response (201):** Returns created ride offer object
</details>

<details>
<summary><strong>GET /search</strong> — Search for matching rides</summary>

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sourceLat` | number | ✅ | Passenger's source latitude |
| `sourceLng` | number | ✅ | Passenger's source longitude |
| `destLat` | number | ✅ | Passenger's destination latitude |
| `destLng` | number | ✅ | Passenger's destination longitude |
| `seats` | number | ✅ | Number of seats required |

**Example:** `/api/rides/search?sourceLat=28.63&sourceLng=77.22&destLat=28.57&destLng=77.32&seats=1`

**Matching Logic:**
- Finds rides with `status: 'waiting'` and sufficient available seats
- Filters rides within **5 km radius** of both source and destination (Haversine formula)
- Excludes rides offered by the searching user
- Results sorted by ascending distance to driver's pickup point
</details>

---

### 📨 Requests (`/api/requests`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Create a ride request (book a ride) |
| `GET` | `/incoming` | ✅ | Get incoming requests (for drivers) |
| `GET` | `/my-requests` | ✅ | Get my requests (for passengers) |
| `PUT` | `/:id/status` | ✅ | Accept or reject a request (driver only) |
| `GET` | `/:id` | ✅ | Get specific request details |
| `GET` | `/:id/messages` | ✅ | Get chat messages for a request |
| `PUT` | `/:id/complete` | ✅ | Complete a specific request with OTP |

<details>
<summary><strong>PUT /:id/status</strong> — Accept or reject a ride request</summary>

**Request Body:**
```json
{
  "status": "accepted"  // or "rejected"
}
```

**Side Effects on Accept:**
- Decreases available seats on the ride offer
- Generates a unique 4-digit completion code (sent to passenger)
- Rejects all other pending requests from the same passenger
- If seats become 0, ride status changes to `'ongoing'`
- Sends real-time Socket.IO notification to the passenger
</details>

---

### ⭐ Ratings (`/api/ratings`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Submit a rating |
| `GET` | `/user/:userId` | ❌ | Get all ratings for a specific user |

<details>
<summary><strong>POST /</strong> — Submit a rating</summary>

**Request Body:**
```json
{
  "rideOfferId": "60f7b2c...",
  "requestId": "60f7b3d...",
  "ratedUserId": "60f7b1a...",
  "rating": 5,
  "review": "Great ride, very safe driver!",
  "raterRole": "passenger"
}
```

**Business Logic:**
- Prevents duplicate ratings (unique index on `requestId + raterId`)
- Updates the rated user's aggregate rating (`ratingSum`, `totalRatings`)
- When **both** driver and passenger have rated each other, the ride request is automatically deleted from history
</details>

---

### 📌 Saved Rides (`/api/saved-rides`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Save a ride/route |
| `GET` | `/` | ✅ | Get all saved rides |
| `DELETE` | `/:id` | ✅ | Delete a saved ride |

---

### 📍 Location Search (`/api/location`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/search?q=<query>` | ❌ | Search for locations (geocoding) |

**Rate Limiting:** 60 requests per minute per IP (stricter than global limit)

**Features:**
- Powered by **Nominatim (OpenStreetMap)** — free, no API key required
- Results cached in-memory for **1 hour** using `node-cache`
- Request queue enforces **1 request/second** to Nominatim to prevent API bans
- Auto-retry on 429 (rate limited) responses with up to 3 retries
- Filtered to Indian locations (`countrycodes=in`)
- Minimum 3 characters required for search

---

## 🗄 Database Models

### User
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | User's full name (required) |
| `email` | String | Unique email address (required) |
| `password` | String | bcrypt hashed password (required) |
| `phone` | String | Phone number |
| `profilePhoto` | String | Base64-encoded profile image |
| `isDriverVerified` | Boolean | Whether driver verification is complete |
| `vehicleNumber` | String | Registered vehicle number |
| `licenseNumber` | String | Driver's license number |
| `vehiclePhoto` | String | Base64-encoded vehicle photo |
| `coins` | Number | Earned reward coins (default: 0) |
| `ratingSum` | Number | Sum of all received ratings |
| `totalRatings` | Number | Count of total ratings received |

### RideOffer
| Field | Type | Description |
|-------|------|-------------|
| `driverId` | ObjectId → User | Reference to the driver |
| `source` | `{ name, lat, lng }` | Pickup location with coordinates |
| `destination` | `{ name, lat, lng }` | Drop-off location with coordinates |
| `seatsAvailable` | Number | Number of available seats (min: 0) |
| `departureTime` | Date | Scheduled departure time |
| `status` | Enum | `waiting` · `ongoing` · `completed` · `cancelled` |

### RideRequest
| Field | Type | Description |
|-------|------|-------------|
| `passengerId` | ObjectId → User | Reference to the passenger |
| `offerId` | ObjectId → RideOffer | Reference to the ride offer |
| `seatsRequested` | Number | Number of seats requested (min: 1) |
| `status` | Enum | `pending` · `accepted` · `rejected` · `completed` |
| `source` | `{ name, lat, lng }` | Passenger's pickup location |
| `destination` | `{ name, lat, lng }` | Passenger's drop-off location |
| `completionCode` | String | 4-digit OTP for ride completion verification |
| `isRatedByPassenger` | Boolean | Whether passenger has rated the driver |
| `isRatedByDriver` | Boolean | Whether driver has rated the passenger |

### Message
| Field | Type | Description |
|-------|------|-------------|
| `requestId` | ObjectId → RideRequest | Associated ride request |
| `senderId` | ObjectId → User | Message sender |
| `text` | String | Message content |

### Rating
| Field | Type | Description |
|-------|------|-------------|
| `rideOfferId` | ObjectId → RideOffer | Associated ride offer |
| `requestId` | ObjectId → RideRequest | Associated ride request |
| `raterId` | ObjectId → User | User giving the rating |
| `ratedUserId` | ObjectId → User | User being rated |
| `rating` | Number | Rating value (1–5) |
| `review` | String | Optional text review |
| `raterRole` | Enum | `driver` or `passenger` |

> **Index:** `{ requestId, raterId }` is unique — prevents duplicate ratings.

### SavedRide
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId → User | Reference to the user |
| `source` | `{ name, lat, lng }` | Saved source location |
| `destination` | `{ name, lat, lng }` | Saved destination location |
| `seats` | Number | Default number of seats |

---

## 🔌 Real-Time Events (Socket.IO)

KindLift uses **Socket.IO** for real-time communication between drivers and passengers.

### Connection Flow
```
Client connects → emits 'join' with userId → Server joins user to their room
```

### Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `join` | Client → Server | `userId` | Join user's personal room |
| `send_message` | Client → Server | `{ requestId, senderId, receiverId, text }` | Send a chat message |
| `receive_message` | Server → Client | Message object | Receive a new message |
| `new_request` | Server → Client | RideRequest object | Notify driver of new booking request |
| `request_updated` | Server → Client | RideRequest object | Notify passenger of status change |

---

## 🌐 Deployment

### Current Deployment

- **Backend:** Deployed on [Render](https://render.com) at `https://kindlift-1.onrender.com`
- **Frontend:** Deployed on [Render](https://render.com) (static site)
- **Database:** MongoDB Atlas (cloud-hosted)

### Deploy Your Own

#### Backend (Render)
1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables from `.env`

#### Frontend (Render)
1. Create a new **Static Site** on Render
2. Set build command: `cd frontend && npm install && npm run build`
3. Set publish directory: `frontend/build`
4. Update `lib/api.js` and `lib/socket.js` with your backend URL

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style (formatting, no logic change) |
| `refactor:` | Code refactoring |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks |

---

## 👥 Team

| Name | Role | Contributions |
|------|------|---------------|
| **Vikash** | Lead Developer | Core architecture, backend, deployment |
| **Vishnu Singh** | Developer | Feature implementation, frontend, testing |
| **Yash Gupta** | Developer | Feature support |

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by Team T11**

[⬆ Back to top](#-kindlift--personalized-travel-companion-platform)

</div>
