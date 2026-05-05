# 🚗 KindLift — Personalized Travel Companion Platform

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2451?style=for-the-badge&logo=razorpay&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.1-000000?style=for-the-badge&logo=flask&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A modern ride-sharing web application that connects solo travelers with vehicle owners for safe, shared journeys — powered by AI-driven sentiment analysis.**

[Live Demo](https://kindlift.in) · [Report Bug](https://github.com/vikash893/kindlift/issues) · [Request Feature](https://github.com/vikash893/kindlift/issues)

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
- [ML Service](#-ml-service--sentiment-analysis)
- [Real-Time Events](#-real-time-events-socketio)
- [Security](#-security)
- [Testing](#-testing)
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
- 👥 **Friend System** — Send, accept, and manage friend connections with real-time notifications
- 📩 **Direct Messaging** — Private conversations between friends with emoji reactions
- 😍 **Emoji Reactions** — WhatsApp/Instagram-style react to messages (❤️ 😂 😮 😢 🙏 👍)
- 🔔 **Notification Center** — Role-based notifications with real-time delivery and badge counts
- 🔒 **Secure Completion** — 4-digit OTP codes ensure verified ride completion
- 🪙 **Coin Rewards** — Gamified incentive system rewarding both drivers and passengers
- 💳 **Razorpay Payments** — Purchase coins with secure Razorpay payment gateway integration
- ⭐ **Rating System** — Mutual driver/passenger ratings build trust and accountability
- 🤖 **AI Sentiment Analysis** — ML-powered review classification (positive/neutral/negative)
- 👤 **Public User Profiles** — Instagram-style profile view with stats, reviews, and friend lists
- 🎁 **Social Gifting** — Send themed gifts to friends, earn reputation badges, build gifting streaks
- 🏆 **Gifting Leaderboard** — Reputation tiers (Bronze → Diamond), public gift walls, and badge progression
- 📊 **Admin Analytics** — Interactive Recharts dashboards with growth trends, status distributions, and rating analysis
- 🛡 **Admin Dashboard** — Full platform management with analytics, user/ride/rating oversight
- 📬 **Contact Form** — Persistent contact submissions with rate limiting and admin triage

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
| **Rate Passengers** | Leave 1-5 star ratings with text reviews for passengers post-ride  |

### For Passengers
| Feature | Description |
|---------|-------------|
| **Search Rides** | Find matching rides based on source/destination coordinates           |
| **Book Rides** | Request seats on available rides with real-time notifications           |
| **Real-Time Chat** | Message drivers in real-time after booking                          |
| **Rate Drivers** | Leave 1-5 star ratings with text reviews post-ride                    |
| **Save Routes** | Bookmark frequently used routes for quick access                       |
| **Add Friends** | Search users, send/accept friend requests, manage connections          |
| **Direct Messages** | Private DM conversations with friends (separate from ride chat)    |
| **Emoji Reactions** | React to DMs with emojis — double-click for ❤️, long-press for picker |
| **View Profiles** | Visit Instagram-style public profiles of other users                 |
| **Send Gifts** | Send themed gifts (12 types across 5 categories) to any user with coins  |
| **Gift Wall** | Showcase received gifts on your public profile for others to see          |
| **Reputation Badge** | Earn reputation points and climb badge tiers from Bronze to Diamond |
| **Buy Coins** | Purchase coins via Razorpay payment gateway (₹10 = 1000 coins)          |
| **Submit Feedback** | Provide general platform feedback via the dedicated feedback page |

### For Admins
| Feature | Description |
|---------|-------------|
| **Analytics Dashboard** | Platform-wide statistics — users, rides, requests, ratings, messages |
| **Interactive Charts** | Recharts-powered analytics: user growth, ride trends, rating analysis  |
| **User Management** | Search, filter, activate/deactivate, promote to admin, delete users    |
| **Ride Management** | View all rides, change status, delete rides and related requests        |
| **Request Oversight** | Browse all ride requests with status filtering and pagination          |
| **Rating Moderation** | View, delete ratings; AI sentiment analysis on review text             |
| **AI Sentiment Analysis** | Analyze review sentiments in bulk using the ML microservice         |
| **Contact Messages** | View and manage contact form submissions from the public contact page  |

### General
| Feature | Description |
|---------|-------------|
| **OTP Email Verification** | Email-based OTP verification during registration             |
| **Forgot Password** | Secure multi-step password reset via OTP (email → verify → reset)  |
| **Google OAuth Login** | One-click sign-in with Google account                             |
| **Interactive Maps** | MapLibre GL JS-powered maps for location selection and ride visualization |
| **3D Hero Section** | Immersive Three.js-powered landing page with animated car model     |
| **Sidebar Navigation** | Persistent left-side dashboard navigation with mobile slide-out |
| **Notification Bell** | Real-time notification badge with dynamic dropdown positioning     |
| **Skeleton Loaders** | Futuristic shimmer skeleton animations for seamless page data loading |
| **Button Loaders** | Clean pulse-bounce animations for all form submissions and actions |
| **Page Transitions** | Cinematic entrance animations, staggered reveals, typewriter text  |
| **Particle Field** | Interactive canvas-based particle system with mouse reactivity       |
| **Aurora Backgrounds** | Animated gradient mesh backgrounds for premium visual depth       |
| **3D Tilt Cards** | Perspective-based hover tilt effect with inner glow following cursor  |
| **Location Autocomplete** | Reusable location input with geocoding, GPS, and auto-resolve  |
| **Responsive Design** | Fully responsive UI with mobile-first approach                    |
| **Custom Cursor** | Cuberto-style custom cursor for premium feel                          |
| **Custom Alert System** | Toast notifications and modal dialogs replacing native `alert()`  |
| **Contact Form** | Working contact form with backend persistence and rate limiting        |
| **SEO Optimization** | Comprehensive Meta tags, Open Graph data, and Schema.org JSON-LD  |
| **Code Splitting** | Lazy-loaded pages with React Suspense for faster initial loads       |
| **Static Pages** | Privacy Policy, Terms of Service, Safety Guidelines, FAQs             |
| **404 Page** | Custom "Not Found" error page for invalid routes                         |
| **Profile Management** | Edit name, phone, profile photo from a dedicated profile page      |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with functional components and hooks |
| **React Router v7** | Client-side routing with protected & public routes |
| **Tailwind CSS 3.4** | Utility-first CSS framework for styling |
| **Three.js / React Three Fiber** | 3D hero section with animated car model |
| **MapLibre GL JS** | Open-source vector maps for ride location display |
| **Socket.IO Client** | Real-time messaging with WebSocket transport |
| **Firebase Auth** | Google OAuth sign-in integration |
| **Axios** | HTTP client with JWT auth interceptors |
| **Lucide React** | Modern icon library |
| **Recharts** | Interactive data visualization (Area, Bar, Line, Pie charts) |
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
| **Nodemailer** | OTP email delivery via Gmail SMTP / Resend API |
| **Helmet** | Secure HTTP headers (CSP, X-Frame-Options, HSTS) |
| **hpp** | HTTP Parameter Pollution protection |
| **xss** | XSS sanitization of all request inputs |
| **express-validator** | Request body/query/param validation |
| **express-rate-limit** | API rate limiting (300/min global, 20/15min auth, 60/min location, 5/15min contact) |
| **compression** | Gzip/Brotli response compression (50-70% payload reduction) |
| **node-cache** | In-memory caching for geocoding results (1 hour TTL) |
| **p-queue** | Request queuing for Nominatim API (1 req/sec) |
| **Razorpay** | Payment gateway SDK for coin purchases |

### ML Service
| Technology | Purpose |
|------------|---------|
| **Python 3.10+** | ML runtime |
| **Flask 3.1** | Lightweight REST API microservice |
| **scikit-learn 1.8** | Random Forest classifier for sentiment prediction |
| **TF-IDF Vectorizer** | Text feature extraction (top 5000 words, unigrams + bigrams) |
| **joblib** | Model serialization/deserialization |
| **pandas** | Data processing for model training |
| **gunicorn** | Production WSGI server |

---

## 🏗 Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND                               │
│   React 19 + Tailwind CSS + Three.js + MapLibre GL + Firebase  │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Pages   │  │Components│  │ Context  │  │  Code Split  │  │
│  │(23 pages)│  │(20 comps)│  │(3 ctxts) │  │ (lazy load)  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────────────┘  │
│       │              │             │                            │
│  ┌────┴──────────────┴─────────────┴──────┐                    │
│  │          lib/api.js (Axios)            │ ← JWT Token        │
│  │          lib/socket.js (Socket.IO)     │ ← WebSocket        │
│  └────────────────┬───────────────────────┘                    │
└───────────────────┼────────────────────────────────────────────┘
                    │ HTTPS / WSS
┌───────────────────┼────────────────────────────────────────────┐
│                   ▼      BACKEND                                │
│  ┌──────────────────────────────────────────────┐               │
│  │           Express.js Server                   │               │
│  │  ┌────────────────────────────────────────┐   │               │
│  │  │         Security Middleware Layer       │   │               │
│  │  │  Helmet · CORS · HPP · Rate Limiter    │   │               │
│  │  │  XSS Sanitize · Input Validate · Auth  │   │               │
│  │  └────────────────────────────────────────┘   │               │
│  │                                                │               │
│  │  ┌─────────┐  ┌─────────┐  ┌────────┐        │               │
│  │  │  Auth   │  │  Rides  │  │Location│        │               │
│  │  │ Routes  │  │ Routes  │  │ Routes │        │               │
│  │  └─────────┘  └─────────┘  └────────┘        │               │
│  │  ┌─────────┐  ┌─────────┐  ┌────────┐        │               │
│  │  │Requests │  │ Ratings │  │ Saved  │        │               │
│  │  │ Routes  │  │ Routes  │  │ Rides  │        │               │
│  │  └─────────┘  └─────────┘  └────────┘        │               │
│  │  ┌─────────┐  ┌─────────┐  ┌────────┐        │               │
│  │  │ Friends │  │   DM    │  │Notifs  │        │               │
│  │  │ Routes  │  │ Routes  │  │ Routes │        │               │
│  │  └─────────┘  └─────────┘  └────────┘        │               │
│  │  ┌─────────┐  ┌─────────┐  ┌────────┐        │               │
│  │  │ Admin   │  │Feedback │  │ Stats  │        │               │
│  │  │ Routes  │  │ Routes  │  │ Routes │        │               │
│  │  └─────────┘  └─────────┘  └────────┘        │               │
│  │  ┌─────────┐  ┌─────────┐                    │               │
│  │  │Payment  │  │Contact  │                    │               │
│  │  │ Routes  │  │ Routes  │                    │               │
│  │  └─────────┘  └─────────┘                    │               │
│  │  ┌─────────┐                                    │               │
│  │  │ Gifts   │                                    │               │
│  │  │ Routes  │                                    │               │
│  │  └─────────┘                                    │               │
│  └────────────────┬──────────────────────────────┘               │
│                   │                                               │
│  ┌────────────────┼───────────────────────┐                      │
│  │  Socket.IO     ▼    Server             │                      │
│  │  • join room  • send_message           │                      │
│  │  • dm_message • dm_reaction            │                      │
│  │  • friend_request • notification       │                      │
│  │  • gift_received                      │                      │
│  └────────────────┬───────────────────────┘                      │
└───────────────────┼──────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌──────────────┐  ┌──────────────────────────────────────┐
│   DATABASE   │  │        ML MICROSERVICE                │
│ MongoDB Atlas│  │  Flask + scikit-learn + TF-IDF        │
│              │  │                                        │
│ ┌──────────┐ │  │  POST /predict  → sentiment analysis  │
│ │  Users   │ │  │  GET  /health   → health check        │
│ │RideOffers│ │  │                                        │
│ │RideReqs  │ │  │  Random Forest (200 trees)             │
│ │ Messages │ │  │  TF-IDF (5000 features, bigrams)       │
│ │DirectMsgs│ │  │  3-class: positive/neutral/negative    │
│ │Friendshps│ │  └──────────────────────────────────────┘
│ │ Ratings  │ │
│ │SavedRides│ │
│ │Notificatn│ │
│ │ Feedback │ │
│ │ContactMsg│ │
│ │Transactn │ │
│ │  Gifts   │ │
│ │GiftTypes │ │
│ │SenderRep │ │
│ │  OTPs    │ │
│ └──────────┘ │
└──────────────┘
```

---

## 📁 Project Structure

```
kindlift/
├── backend/                        # Express.js API server
│   ├── admin/
│   │   └── getuser.js              # Admin panel API (stats, CRUD for users/rides/ratings)
│   ├── config/
│   │   └── db.js                   # MongoDB connection setup
│   ├── middleware/
│   │   ├── auth.js                 # JWT authentication middleware
│   │   ├── sanitize.js             # XSS sanitization middleware (strips HTML/script tags)
│   │   └── validate.js             # Input validation rules (express-validator)
│   ├── models/
│   │   ├── User.js                 # User schema (auth, admin, driver, coins, ratings)
│   │   ├── RideOffer.js            # Ride offer schema (source, destination, seats, status)
│   │   ├── RideRequest.js          # Ride request schema (booking, OTP, rating flags)
│   │   ├── Message.js              # Chat message schema (linked to ride requests)
│   │   ├── DirectMessage.js        # DM schema (friend-to-friend, emoji reactions)
│   │   ├── Friendship.js           # Friendship schema (send, accept, reject, block)
│   │   ├── Notification.js         # Notification schema (role-based, real-time, TTL)
│   │   ├── Rating.js               # Rating schema (1-5 stars, reviews, duplicate prevention)
│   │   ├── SavedRide.js            # Saved ride/route schema
│   │   ├── Feedback.js             # General platform feedback schema
│   │   ├── ContactMessage.js       # Contact form submission schema (name, email, message, read)
│   │   ├── Transaction.js          # Razorpay payment transaction schema (coins, orderId)
│   │   ├── Gift.js                 # Gift record schema (sender, receiver, type, mood, reactions)
│   │   ├── GiftType.js             # Gift type catalog schema (categories, icons, coin bounds)
│   │   ├── SenderReputation.js     # Gifting reputation schema (badges, streaks, perks)
│   │   └── OTP.js                  # OTP schema (registration + password reset, auto-expiry)
│   ├── routes/
│   │   ├── auth.js                 # Auth routes (register, login, OTP, Google OAuth, forgot/reset password)
│   │   ├── rides.js                # Ride management (create, search, my-offers, complete)
│   │   ├── requests.js             # Request handling (create, accept/reject, complete, messages)
│   │   ├── ratings.js              # Rating submission, retrieval, and ML sentiment proxy
│   │   ├── savedRides.js           # Saved routes CRUD operations
│   │   ├── friends.js              # Friend system (send, accept, reject, search, status, profile)
│   │   ├── dm.js                   # Direct messaging with emoji reactions
│   │   ├── notifications.js        # Notification management (CRUD, read/unread, broadcast)
│   │   ├── stats.js                # Public platform statistics
│   │   ├── location.js             # Location search with Nominatim geocoding
│   │   ├── payment.js              # Razorpay payment (create order, verify, add coins)
│   │   ├── contact.js              # Contact form submission (rate-limited, validated)
│   │   ├── gifts.js               # Social gifting system (send, receive, react, leaderboard)
│   │   └── Feedback.js             # Feedback submission route
│   ├── tests/                      # Unit tests
│   │   ├── middleware/             # Middleware tests (sanitize, etc.)
│   │   ├── models/                 # Model tests
│   │   └── utils/                  # Utility tests (geocoder, etc.)
│   ├── utils/
│   │   ├── geocoder.js             # Geocoding + Haversine distance calculation
│   │   └── sendEmail.js            # Email utility (Gmail SMTP / Resend API / custom SMTP)
│   ├── .env.example                # Environment variable template
│   ├── server.js                   # Application entry point (security stack + Socket.IO)
│   └── package.json                # Backend dependencies
│
├── frontend/                       # React SPA
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminAnalytics.js   # Recharts analytics (user growth, ride trends, ratings)
│   │   │   ├── CustomAlert.js      # Toast + modal alert system (replaces native alerts)
│   │   │   ├── CustomCursor.js     # Cuberto-style animated cursor
│   │   │   ├── Footer.js           # Global footer component
│   │   │   ├── GradientMesh.js     # Aurora gradient backgrounds and floating orbs
│   │   │   ├── HeroCar3D.js        # Three.js 3D car hero section
│   │   │   ├── InteractiveCards.js  # 3D tilt cards, morphing borders, number tickers
│   │   │   ├── Loader.js           # Loading spinner component
│   │   │   ├── ButtonLoader.js     # Button bounce loading animation
│   │   │   ├── LocationInput.js    # Reusable location autocomplete with GPS
│   │   │   ├── SkeletonLoader.js   # Shimmer loading skeleton UI
│   │   │   ├── MagneticButton.js   # Magnetic hover effect button
│   │   │   ├── MarqueeText.js      # Scrolling marquee text
│   │   │   ├── Navbar.js           # Responsive top navigation bar (for guests)
│   │   │   ├── Sidebar.js          # Persistent left navigation (for logged-in users)
│   │   │   ├── NotificationBell.js # Notification bell with dropdown panel
│   │   │   ├── PageTransitions.js  # Cinematic page reveals, stagger, typewriter
│   │   │   ├── ParticleField.js    # Interactive canvas particle system
│   │   │   ├── ScrollToTop.js      # Route-change scroll restoration
│   │   │   └── TextReveal.js       # Scroll-triggered text animation
│   │   ├── context/
│   │   │   ├── AuthContext.js      # React Context for auth state management
│   │   │   ├── NotificationContext.js # Real-time notification state + Socket.IO integration
│   │   │   └── ThemeContext.js     # Theme/dark-mode context provider
│   │   ├── lib/
│   │   │   ├── api.js              # Axios instance with JWT interceptor
│   │   │   ├── apiCache.js         # Client-side API response caching layer
│   │   │   ├── socket.js           # Socket.IO client configuration
│   │   │   └── useLocationSearch.js # Location autocomplete hook (debounce, cache, GPS, geocode fallback)
│   │   ├── pages/
│   │   │   ├── Home.js             # Landing page with 3D hero
│   │   │   ├── About.js            # About page
│   │   │   ├── Contact.js          # Contact form page (with backend submission)
│   │   │   ├── Login.js            # Login page (email + Google OAuth)
│   │   │   ├── Register.js         # Registration page with OTP verification
│   │   │   ├── ForgotPassword.js   # Multi-step password reset (email → OTP → new password)
│   │   │   ├── Dashboard.js        # User dashboard (offers, requests, stats, ratings)
│   │   │   ├── OfferRide.js        # Create ride offer with map
│   │   │   ├── BookRide.js         # Search and book rides
│   │   │   ├── RideDetails.js      # Ride details with chat and map
│   │   │   ├── Profile.js          # User profile management
│   │   │   ├── UserProfile.js      # Public user profile (Instagram-style, stats, reviews)
│   │   │   ├── Friends.js          # Friend system (search, send, accept, manage)
│   │   │   ├── Messages.js         # Direct messaging with emoji reactions
│   │   │   ├── AdminPanel.js       # Admin dashboard with analytics + CRUD management
│   │   │   ├── Gifts.js            # Social gifting page (send, receive, reputation, reactions)
│   │   │   ├── Feedback.js         # Platform feedback submission page
│   │   │   ├── FAQs.js             # Frequently asked questions
│   │   │   ├── Safety.js           # Safety guidelines page
│   │   │   ├── PrivacyPolicy.js    # Privacy policy page
│   │   │   ├── TermsOfService.js   # Terms of service page
│   │   │   └── NotFound.js         # Custom 404 page
│   │   ├── firebase.js             # Firebase configuration (Google Auth)
│   │   ├── App.js                  # Root component with routing + code splitting
│   │   ├── App.css                 # Global app styles
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Tailwind CSS directives and custom styles
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── postcss.config.js           # PostCSS configuration
│   └── package.json                # Frontend dependencies
│
├── ml/                             # Python ML microservice
│   ├── app.py                      # Flask API server (predict + health endpoints)
│   ├── train_model.py              # Model training script (Random Forest + TF-IDF)
│   ├── requirements.txt            # Python dependencies
│   └── models/                     # Serialized ML artifacts
│       ├── rating_model_final.pkl  # Trained Random Forest classifier
│       ├── tfidf_vectorizer.pkl    # Fitted TF-IDF vectorizer (5000 features)
│       └── target_encoder.pkl      # Label encoder (positive/neutral/negative)
│
├── CONTRIBUTING.md                 # Contribution guidelines
├── LICENSE                         # MIT License
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **Python** 3.10 or higher — [Download](https://www.python.org/) *(for ML service)*
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

4. **Install ML service dependencies**

   ```bash
   cd ../ml
   pip install -r requirements.txt
   ```

5. **Configure environment variables** (see [Environment Variables](#-environment-variables))

6. **Start the backend server**

   ```bash
   cd backend
   node server.js
   ```

   The API server will start on `http://localhost:8000`

7. **Start the ML microservice** *(optional — required for sentiment analysis)*

   ```bash
   cd ml
   python app.py
   ```

   The ML service will start on `http://localhost:5001`

8. **Start the frontend development server**

   ```bash
   cd frontend
   npm start
   ```

   The React app will open on `http://localhost:3000`

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory (see `.env.example` for a template):

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

# ─── ML Service (optional) ──────────────────────────
ML_SERVICE_URL=http://localhost:5001

# ─── Razorpay Payments (optional) ───────────────────
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> **Note:** For Gmail, you must generate an **App Password** (not your regular password). Enable 2FA on your Google account first, then go to *Security → App Passwords → Generate*.

> **Tip:** Alternative email providers are supported — set `RESEND_API_KEY` for the Resend service or `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` for a custom SMTP server.

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
| `POST` | `/google` | ❌ | Google OAuth login/registration |
| `GET` | `/me` | ✅ | Get current authenticated user profile |
| `PUT` | `/update-profile` | ✅ | Update user profile (name, phone, photo) |
| `POST` | `/send-otp` | ❌ | Send OTP to email for registration verification |
| `POST` | `/verify-otp` | ❌ | Verify OTP code |
| `POST` | `/forgot-password` | ❌ | Send password reset OTP |
| `POST` | `/verify-reset-otp` | ❌ | Verify password reset OTP |
| `POST` | `/reset-password` | ❌ | Reset password with verified OTP |

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
    "isDriverVerified": false,
    "isAdmin": false,
    "role": "user"
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
    "isDriverVerified": true,
    "isAdmin": false,
    "role": "user"
  }
}
```
</details>

<details>
<summary><strong>POST /google</strong> — Google OAuth login</summary>

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "photo": "https://..."
}
```

**Response (200):** Returns JWT token and user object. Creates a new user if email is not registered.
</details>

<details>
<summary><strong>POST /send-otp</strong> — Send OTP to email</summary>

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):** `{ "message": "OTP sent ✅" }`
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

<details>
<summary><strong>POST /forgot-password</strong> — Request password reset</summary>

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):** `{ "message": "Reset OTP sent ✅" }`

> **Security:** Does not reveal whether the email exists in the system.
</details>

<details>
<summary><strong>POST /verify-reset-otp</strong> — Verify password reset OTP</summary>

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):** `{ "message": "OTP verified ✅" }`
</details>

<details>
<summary><strong>POST /reset-password</strong> — Reset password</summary>

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newsecurepassword"
}
```

**Response (200):** `{ "message": "Password reset successful ✅" }`
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
| `POST` | `/` | ✅ | Submit a rating (validated + authorized) |
| `GET` | `/user/:userId` | ❌ | Get all ratings for a specific user |
| `POST` | `/predict-sentiment` | ✅ 🔒 | Predict review sentiment via ML (admin only) |
| `GET` | `/sentiment/:userId` | ✅ 🔒 | Get sentiment summary for a user (admin only) |

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
- **Authorization:** Only users involved in the ride can rate; self-rating is blocked
- Prevents duplicate ratings (unique index on `requestId + raterId`)
- Updates the rated user's aggregate rating (`ratingSum`, `totalRatings`)
- When **both** driver and passenger have rated each other, the ride request is automatically deleted from history
</details>

<details>
<summary><strong>POST /predict-sentiment</strong> — ML sentiment prediction (Admin)</summary>

**Request Body:**
```json
{
  "review": "the driver was very friendly and helpful"
}
```

**Response (200):**
```json
{
  "predicted_sentiment": "positive",
  "confidence": "high",
  "confidence_score": 0.85,
  "input": "the driver was very friendly and helpful"
}
```

Proxies the request to the Python ML microservice.
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

### 💬 Feedback (`/api/feedback`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/feedback` | ❌ | Submit platform feedback |

---

### 📬 Contact (`/api/contact`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ❌ | Submit a contact form message |

**Rate Limiting:** 5 submissions per 15 minutes per IP

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "message": "I have a question about..."
}
```

**Validation:**
- All fields required (`firstName`, `lastName`, `email`, `message`)
- Valid email format required
- Message must be at least 10 characters
- Messages stored in DB with `read` status for admin triage

---

### 💳 Payments (`/api/payment`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/create-order` | ❌ | Create a Razorpay order for coin purchase |
| `POST` | `/verify-payment` | ✅ | Verify payment signature and credit coins |

**Payment Flow:**
1. Frontend calls `/create-order` with `{ amount }` (in ₹)
2. Razorpay checkout opens in the browser
3. On success, frontend sends payment details to `/verify-payment`
4. Backend verifies HMAC-SHA256 signature against Razorpay secret
5. On valid signature: credits coins to user, saves transaction record
6. Duplicate payment detection via `paymentId` uniqueness check

**Coin Rate:** ₹10 = 1,000 coins (dynamic calculation)

---

### 🎁 Gifts (`/api/gifts`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/send` | ✅ | Send a gift to another user (atomic wallet debit + credit) |
| `GET` | `/received` | ✅ | Get paginated received gifts (filters: bookmarked, showcased, unopened) |
| `GET` | `/sent` | ✅ | Get paginated sent gifts |
| `GET` | `/types` | ❌ | Get gift type catalog (auto-seeds 12 types on first access) |
| `GET` | `/:giftId` | ✅ | Get single gift details (sender or receiver only) |
| `PATCH` | `/:giftId/open` | ✅ | Mark a received gift as opened |
| `PATCH` | `/:giftId/bookmark` | ✅ | Toggle bookmark on a received gift |
| `PATCH` | `/:giftId/showcase` | ✅ | Toggle showcase on a received gift (public gift wall) |
| `POST` | `/:giftId/react` | ✅ | Add receiver reaction (loved, moved, laughing) |
| `GET` | `/wall/:userId` | ❌ | Get public gift wall (showcased gifts) for a user |
| `GET` | `/leaderboard` | ❌ | Top givers ranked by reputation |
| `GET` | `/reputation` | ✅ | Current user's reputation, badge tier, and progress |

<details>
<summary><strong>POST /send</strong> — Send a gift</summary>

**Request Body:**
```json
{
  "receiver_id": "60f7b2c...",
  "coin_value": 25,
  "gift_type_key": "thank_you",
  "message": "Thanks for the ride!",
  "mood_tag": "grateful",
  "is_anonymous": false,
  "is_public": true
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "gift_id": "60f7d4e...",
    "sender_new_reputation": 42,
    "badge_progress": {
      "current": "Bronze Giver",
      "next": "Silver Giver",
      "progressPct": 42,
      "auraColor": "#CD7F32"
    },
    "wallet_balance_remaining": 975,
    "gift_type": {
      "key": "thank_you",
      "displayName": "Thank You",
      "icon": "🤍",
      "colorHex": "#D4A038"
    }
  }
}
```

**Anti-Abuse Rules:**
- Self-gifting blocked at schema and route level
- Minimum gift value: 5 coins
- Daily send limit: 20 gifts per day
- Daily spend limit: 2,000 coins per day
- Velocity limit: Max 5 gifts to the same receiver per hour
- Atomic debit/credit with rollback on failure
</details>

**Gift Types (12 built-in, auto-seeded):**

| Category | Types |
|----------|-------|
| Appreciation | Thank You 🤍, Deep Respect 🌿, Recognition ⭐ |
| Celebration | Congrats 🎊, Achievement Unlocked 🏆, Milestone 🎯 |
| Support | Stay Strong 💙, We Got You 🤝, I Believe In You 🌱 |
| Playful | Hype Train 🚀, Good Vibes 🌊 |
| Exclusive | Legendary 👑 (500+ coins) |

**Reputation & Badge Tiers:**

| Tier | Min Reputation | Perks |
|------|---------------|-------|
| Bronze Giver | 0 | — |
| Silver Giver | 100 | Animated border |
| Gold Giver | 500 | Profile highlight, priority suggestions |
| Platinum Giver | 2,000 | Exclusive skins |
| Diamond Giver | 10,000 | Legendary gift type unlock |

---

### 👤 User Profile (`/api/friends/profile`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/profile/:userId` | ✅ | Get Instagram-style public profile for a user |

**Response includes:**
- User info (name, email, photo, coins, avg rating, member since)
- Friends list with count
- All ratings/reviews received
- Ride statistics (offered, completed, requested, booked)
- Friendship status with the requesting user (`none`, `pending`, `accepted`, `self`)


### 👥 Friends (`/api/friends`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/request` | ✅ | Send a friend request |
| `PUT` | `/:id/respond` | ✅ | Accept or reject a friend request |
| `GET` | `/list` | ✅ | Get all accepted friends |
| `GET` | `/pending` | ✅ | Get incoming pending friend requests |
| `GET` | `/sent` | ✅ | Get outgoing pending friend requests |
| `GET` | `/search?q=<query>` | ✅ | Search users to add as friends |
| `GET` | `/status/:userId` | ✅ | Check friendship status with a user |
| `GET` | `/profile/:userId` | ✅ | Get public user profile (stats, reviews, friends) |
| `DELETE` | `/:id` | ✅ | Remove a friend or cancel a request |

**Features:**
- Duplicate request prevention via unique compound index
- Re-send support after rejection (auto-updates existing record)
- Real-time Socket.IO notifications for friend requests/responses
- User search returns friendship status per result (none/pending/accepted/blocked)

---

### 📩 Direct Messages (`/api/dm`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/send` | ✅ | Send a DM to an accepted friend |
| `GET` | `/conversations` | ✅ | Get all conversations with latest message + unread count |
| `GET` | `/:userId/messages` | ✅ | Get paginated messages with a friend |
| `GET` | `/unread/count` | ✅ | Get total unread DM count |
| `PUT` | `/:userId/read` | ✅ | Mark all messages from a user as read |
| `PUT` | `/react` | ✅ | Toggle emoji reaction on a message |

**Emoji Reactions:**
- Quick emojis: ❤️ 😂 😮 😢 🙏 👍
- Toggle behavior: same emoji = remove, different emoji = replace
- One reaction per user per message
- Real-time sync via `dm_reaction` Socket.IO event

**Access Control:** Only accepted friends can exchange messages (enforced by `requireFriendship` middleware).

---

### 🔔 Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✅ | Get paginated notifications (supports `?unreadOnly=true`) |
| `GET` | `/unread/count` | ✅ | Get unread notification count (navbar bell) |
| `PUT` | `/read-all` | ✅ | Mark all notifications as read |
| `PUT` | `/:id/read` | ✅ | Mark a single notification as read |
| `DELETE` | `/:id` | ✅ | Delete a notification |
| `POST` | `/` | ✅ 🔒 | Create broadcast/targeted notification (admin only) |

**Notification Types:** `ride_accepted`, `ride_rejected`, `ride_completed`, `ride_request`, `verification_approved`, `verification_rejected`, `new_verification`, `new_user`, `new_feedback`, `new_rating`, `friend_request`, `friend_accepted`, `dm_message`, `gift_received`, `gift_reaction`, `system`

**Features:**
- Role-based targeting: specific user, all admins, all users, or broadcast
- Auto-cleanup via TTL index (90-day expiration)
- Real-time delivery via Socket.IO `notification` event

---

### 📊 Public Stats (`/api/stats`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ❌ | Get platform statistics (happy journeys, match accuracy, active cities) |

---

### 🛡 Admin (`/api/admin`)

All admin endpoints require JWT authentication **and** admin privileges.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/login` | ❌ | Admin-specific login (verifies admin role) |
| `GET` | `/stats` | ✅ 🔒 | Platform-wide analytics dashboard |
| `GET` | `/users` | ✅ 🔒 | List users with pagination, search, filters |
| `GET` | `/users/:id` | ✅ 🔒 | Get full user details with ride stats |
| `PUT` | `/users/:id` | ✅ 🔒 | Update user (activate/deactivate, promote, coins) |
| `DELETE` | `/users/:id` | ✅ 🔒 | Delete user and all related data |
| `GET` | `/rides` | ✅ 🔒 | List rides with pagination and status filters |
| `PUT` | `/rides/:id` | ✅ 🔒 | Update ride status |
| `DELETE` | `/rides/:id` | ✅ 🔒 | Delete ride and related requests |
| `GET` | `/requests` | ✅ 🔒 | List all ride requests |
| `GET` | `/ratings` | ✅ 🔒 | List all ratings with user details |
| `DELETE` | `/ratings/:id` | ✅ 🔒 | Delete rating (reverses aggregate) |
| `GET` | `/profile` | ✅ 🔒 | Get admin's own profile |
| `PUT` | `/profile` | ✅ 🔒 | Update admin's profile |
| `POST` | `/make-admin` | ✅ 🔒 | Promote user to admin (superadmin only) |

> 🔒 = Requires admin/superadmin role. Stats endpoint is cached server-side for 60 seconds.

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
| `isAdmin` | Boolean | Whether the user has admin privileges (default: false) |
| `role` | Enum | `user` · `admin` · `superadmin` (default: user) |
| `isDriverVerified` | Boolean | Whether driver verification is complete |
| `driverVerificationStatus` | Enum | `none` · `pending` · `approved` · `rejected` (default: none) |
| `driverVerificationNote` | String | Admin feedback on verification decision |
| `vehicleNumber` | String | Registered vehicle number |
| `licenseNumber` | String | Driver's license number |
| `vehiclePhoto` | String | Base64-encoded vehicle photo |
| `coins` | Number | Earned reward coins (default: 0) |
| `ratingSum` | Number | Sum of all received ratings |
| `totalRatings` | Number | Count of total ratings received |
| `isActive` | Boolean | Account active status (default: true) |

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
| `coinsCharged` | Number | Coins deducted from passenger at booking time (2 coins/km) |
| `isRatedByPassenger` | Boolean | Whether passenger has rated the driver |
| `isRatedByDriver` | Boolean | Whether driver has rated the passenger |

### Message
| Field | Type | Description |
|-------|------|-------------|
| `requestId` | ObjectId → RideRequest | Associated ride request |
| `senderId` | ObjectId → User | Message sender |
| `text` | String | Message content (max 2000 chars, validated via Socket.IO) |

### DirectMessage
| Field | Type | Description |
|-------|------|-------------|
| `senderId` | ObjectId → User | User who sent the message |
| `receiverId` | ObjectId → User | User who receives the message |
| `text` | String | Message content (max 2000 chars) |
| `read` | Boolean | Whether the recipient has read the message |
| `reactions` | Array | Emoji reactions: `[{ userId, emoji }]` |

> **Indexes:** `{ senderId, receiverId, createdAt }` for conversation lookup; `{ receiverId, read }` for unread counts.

### Friendship
| Field | Type | Description |
|-------|------|-------------|
| `requester` | ObjectId → User | User who sent the friend request |
| `recipient` | ObjectId → User | User who received the request |
| `status` | Enum | `pending` · `accepted` · `rejected` · `blocked` |

> **Index:** `{ requester, recipient }` is unique — prevents duplicate friend requests.

### Notification
| Field | Type | Description |
|-------|------|-------------|
| `recipientId` | ObjectId → User | Target user (null for broadcasts) |
| `recipientRole` | Enum | `user` · `admin` · `all` · `null` (role-based targeting) |
| `type` | Enum | Notification type (16 types — see API docs) |
| `title` | String | Notification title (required) |
| `message` | String | Notification body (required) |
| `metadata` | Mixed | Optional context data (ride ID, user ID, etc.) |
| `actionUrl` | String | Optional deep link URL |
| `read` | Boolean | Whether notification has been read |
| `readAt` | Date | When it was marked as read |

> **TTL Index:** Notifications auto-delete after **90 days**.

### Rating
| Field | Type | Description |
|-------|------|-------------|
| `rideOfferId` | ObjectId → RideOffer | Associated ride offer |
| `requestId` | ObjectId → RideRequest | Associated ride request |
| `raterId` | ObjectId → User | User giving the rating |
| `ratedUserId` | ObjectId → User | User being rated |
| `rating` | Number | Rating value (1–5) |
| `review` | String | Optional text review (max 500 chars) |
| `raterRole` | Enum | `driver` or `passenger` |

> **Index:** `{ requestId, raterId }` is unique — prevents duplicate ratings.

### SavedRide
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId → User | Reference to the user |
| `source` | `{ name, lat, lng }` | Saved source location |
| `destination` | `{ name, lat, lng }` | Saved destination location |
| `seats` | Number | Default number of seats |

### Feedback
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Submitter's name (required) |
| `email` | String | Submitter's email (required) |
| `message` | String | Feedback message (required) |

### ContactMessage
| Field | Type | Description |
|-------|------|-------------|
| `firstName` | String | Submitter's first name (required, max 100) |
| `lastName` | String | Submitter's last name (required, max 100) |
| `email` | String | Submitter's email (required, max 254) |
| `message` | String | Contact message (required, max 5000) |
| `read` | Boolean | Whether an admin has read the message (default: false) |

### Transaction
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId → User | User who made the payment |
| `amount` | Number | Payment amount in ₹ |
| `coins` | Number | Coins credited to user |
| `paymentId` | String | Razorpay payment ID (unique) |
| `orderId` | String | Razorpay order ID |
| `status` | String | Transaction status (default: `success`) |

### Gift
| Field | Type | Description |
|-------|------|-------------|
| `senderId` | ObjectId → User | User who sent the gift |
| `receiverId` | ObjectId → User | User who received the gift |
| `giftTypeId` | ObjectId → GiftType | Reference to the gift type catalog |
| `coinValue` | Number | Coin amount of the gift (min: 5) |
| `message` | String | Optional personal message (max 500 chars) |
| `moodTag` | Enum | `joyful` · `grateful` · `proud` · `supportive` · `playful` · `null` |
| `isPublic` | Boolean | Whether the gift is visible publicly (default: true) |
| `isAnonymous` | Boolean | Whether sender identity is hidden (default: false) |
| `receiverReaction` | Enum | `loved` · `moved` · `laughing` · `null` |
| `openedAt` | Date | When the receiver opened the gift |
| `bookmarkedAt` | Date | When the receiver bookmarked the gift |
| `showcasedAt` | Date | When the gift was added to the public gift wall |
| `showcaseOrder` | Number | Display order on the gift wall |

> **Validation:** Self-gifting is blocked at the schema level via a `pre('validate')` hook.

### GiftType
| Field | Type | Description |
|-------|------|-------------|
| `key` | String | Unique identifier (e.g., `thank_you`, `legendary`) |
| `category` | Enum | `Appreciation` · `Celebration` · `Support` · `Playful` · `Exclusive` |
| `displayName` | String | Human-readable name |
| `icon` | String | Display emoji |
| `colorHex` | String | Primary accent color |
| `minCoins` | Number | Minimum coin value (default: 5) |
| `maxCoins` | Number | Maximum coin value (null = unlimited) |
| `baseWeightBonus` | Number | Extra reputation points per gift of this type |
| `emotionalWeight` | Enum | `Low` · `Medium` · `High` · `Very High` · `Maximum` |
| `isPremium` | Boolean | Whether unlocking is required |
| `isActive` | Boolean | Whether type is available in the catalog |

> **Auto-seeding:** Gift types are auto-seeded on first access if the database is empty.

### SenderReputation
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId → User | User whose reputation this tracks (unique) |
| `totalReputation` | Number | Cumulative reputation points |
| `badgeTier` | String | Current badge (Bronze/Silver/Gold/Platinum/Diamond Giver) |
| `giftsSentCount` | Number | Total number of gifts sent |
| `uniqueReceiversCount` | Number | Number of distinct recipients |
| `giftingStreakDays` | Number | Consecutive days of gift sending (max: 30) |
| `lastGiftDate` | Date | When the last gift was sent |
| `perksUnlocked` | [String] | Unlocked perks (e.g., `animated_border`, `exclusive_skins`) |

> **Reputation formula:** `(ceil(coinValue / 10) + typeBonus) × streakMultiplier + noveltyBonus`

### OTP
| Field | Type | Description |
|-------|------|-------------|
| `email` | String | Target email address |
| `otp` | String | 6-digit OTP code |
| `expires` | Date | Expiration timestamp (10 min from creation) |
| `verified` | Boolean | Whether the OTP has been verified |
| `purpose` | Enum | `registration` or `password-reset` |

> OTP documents auto-delete 30 minutes after expiry via a TTL index.

---

## 🤖 ML Service — Sentiment Analysis

KindLift includes a **Python Flask microservice** that classifies ride review text into three sentiment categories using a trained Random Forest model.

### How It Works

1. **Training** — The model is trained on the Ola ride review dataset using TF-IDF feature extraction with 5000 features (unigrams + bigrams) and a Random Forest classifier (200 trees, balanced class weights).

2. **Prediction** — Given a review text string, the service returns the predicted sentiment, confidence level, and confidence score.

3. **Integration** — The Node.js backend proxies prediction requests to the Flask service, keeping the ML model isolated from the main application.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict` | Predict sentiment from review text |
| `GET` | `/health` | Service health check |

### Example

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"review": "the driver was very friendly and helpful"}'
```

```json
{
  "predicted_sentiment": "positive",
  "confidence": "high",
  "confidence_score": 0.85,
  "input": "the driver was very friendly and helpful"
}
```

### Retraining the Model

```bash
cd ml
python train_model.py
```

This generates three `.pkl` files in `ml/models/` that the Flask app loads on startup.

---

## 🔌 Real-Time Events (Socket.IO)

KindLift uses **Socket.IO** for real-time communication across the entire platform — ride chat, direct messaging, friend system, and notifications.

### Connection Flow
```
Client connects → emits 'join' with userId → Server joins user to their room
```

### Ride Chat Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `join` | Client → Server | `userId` | Join user's personal room |
| `join_admin` | Client → Server | `userId` | Join shared admin broadcast room |
| `send_message` | Client → Server | `{ requestId, senderId, receiverId, text }` | Send a ride chat message |
| `receive_message` | Server → Client | Message object | Receive a ride chat message |
| `new_request` | Server → Client | RideRequest object | Notify driver of new booking request |
| `request_updated` | Server → Client | RideRequest object | Notify passenger of status change |

### Direct Messaging Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `send_dm` | Client → Server | `{ senderId, receiverId, text }` | Send a DM (socket-based) |
| `dm_message` | Server → Client | DirectMessage object | Receive a new DM (or sent confirmation) |
| `dm_reaction` | Server → Client | `{ messageId, reactions }` | Emoji reaction added/removed/changed |

### Social & Notification Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `friend_request` | Server → Client | `{ _id, requester, status }` | New friend request received |
| `friend_response` | Server → Client | `{ _id, responderId, responderName, status }` | Friend request accepted/rejected |
| `notification` | Server → Client | Notification object | Real-time notification delivery |

### Gifting Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `gift_received` | Server → Client | `{ giftId, senderName, giftType, giftTypeIcon, coinValue }` | Real-time gift received notification |

> **Validation:** Socket messages are validated for required fields and text is limited to 2000 characters. DM socket events verify friendship status before persisting.

---

## 🛡 Security

KindLift implements a **7-layer security stack**, applied in order:

| Layer | Technology | Protection |
|-------|------------|------------|
| 1. HTTP Headers | **Helmet** | X-Content-Type-Options, X-Frame-Options, HSTS, X-XSS-Protection |
| 2. CORS | **cors** | Restricts API access to whitelisted frontend origins |
| 3. Parameter Pollution | **hpp** | Prevents duplicate query parameter injection |
| 4. Rate Limiting | **express-rate-limit** | Global: 300/min, Auth: 20/15min, Location: 60/min |
| 5. XSS Sanitization | **xss** | Recursive HTML/script tag stripping on body, query, params |
| 6. Input Validation | **express-validator** | Type checking, length limits, format validation on all routes |
| 7. Authentication | **JWT + bcrypt** | Token-based auth with 7-day expiry, salted password hashing |

### Additional Security Measures

- **OTP-based email verification** for registration and password reset
- **Server-side OTP verification** — the forgot-password flow requires verified OTP before allowing password reset
- **Admin role system** — `user`, `admin`, `superadmin` with middleware-enforced access control
- **Self-rating prevention** — users cannot rate themselves
- **Duplicate rating prevention** — unique compound index on `{ requestId, raterId }`
- **Proxy trust** — `trust proxy` configured for accurate IP-based rate limiting behind Render.com

---

## 🧪 Testing

The project includes unit tests for middleware, models, and utilities:

```bash
cd backend
npm test
```

Tests cover:
- **Sanitize middleware** — XSS filtering of request body, query, and params
- **Geocoder utility** — Haversine distance calculations
- **Model validations** — Schema constraints and index integrity

---

## 🌐 Deployment

### Current Deployment

- **Backend:** Deployed on [Render](https://render.com) at `https://kindlift-1.onrender.com`
- **Frontend:** Deployed on [Render](https://render.com) at `https://kindlift.onrender.com`
- **ML Service:** Deployed separately (can be co-located or on a dedicated instance)
- **Database:** MongoDB Atlas (cloud-hosted)
- **Domain:** [kindlift.in](https://kindlift.in)

### Deploy Your Own

#### Backend (Render)
1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Set root directory: `backend`
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add all environment variables from `.env`

#### Frontend (Render)
1. Create a new **Static Site** on Render
2. Set build command: `cd frontend && npm install && npm run build`
3. Set publish directory: `frontend/build`
4. Update `lib/api.js` and `lib/socket.js` with your backend URL

#### ML Service (Render / Railway / Fly.io)
1. Create a new **Web Service**
2. Set root directory: `ml`
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Set `ML_SERVICE_URL` in the backend environment variables

---

## 🤝 Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines.

### Quick Start

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
| `security:` | Security improvements |

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

**Built with ❤️ by Team Kindlift**

[⬆ Back to top](#-kindlift--personalized-travel-companion-platform)

</div>
