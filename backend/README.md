# KindLift Backend API

Express.js REST API server with real-time Socket.IO messaging for the KindLift ride-sharing platform.

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and email credentials

# Start server
node server.js
```

Server runs on `http://localhost:8000` by default.

## Project Structure

```
backend/
├── config/
│   └── db.js               # MongoDB Atlas connection via Mongoose
├── middleware/
│   └── auth.js              # JWT token verification middleware
├── models/
│   ├── User.js              # User profile, driver verification, coins, ratings
│   ├── RideOffer.js         # Driver's ride offer (source/dest/seats/time)
│   ├── RideRequest.js       # Passenger's booking request with OTP
│   ├── Message.js           # Real-time chat messages
│   ├── Rating.js            # Post-ride ratings (1-5 stars)
│   └── SavedRide.js         # Bookmarked routes
├── routes/
│   ├── auth.js              # Registration, login, OTP email verification
│   ├── rides.js             # Ride CRUD, search, completion
│   ├── requests.js          # Request lifecycle (create/accept/reject/complete)
│   ├── ratings.js           # Rating submission and retrieval
│   ├── savedRides.js        # Saved routes management
│   └── location.js          # Location search via Nominatim with caching
├── utils/
│   ├── geocoder.js          # Geocoding + Haversine distance formula
│   └── sendEmail.ts         # Nodemailer email utility
├── uploads/                 # File upload storage
├── server.js                # Entry point: Express + Socket.IO setup
├── package.json             # Dependencies and scripts
└── .env                     # Environment variables (not committed)
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/kindlift` |
| `JWT_SECRET` | Secret key for JWT signing | `your_random_secure_string` |
| `EMAIL_USER` | Gmail address for OTP emails | `yourapp@gmail.com` |
| `EMAIL_PASS` | Gmail App Password | `abcd efgh ijkl mnop` |
| `PORT` | Server port (optional) | `8000` |

## API Routes Overview

| Route Group | Base Path | Description |
|-------------|-----------|-------------|
| Auth | `/api/auth` | Registration, login, OTP, profile |
| Rides | `/api/rides` | Ride offers CRUD and search |
| Requests | `/api/requests` | Booking requests lifecycle |
| Ratings | `/api/ratings` | Post-ride rating system |
| Saved Rides | `/api/saved-rides` | Bookmarked routes |
| Location | `/api/location` | Geocoding search |

## Rate Limiting

- **Global:** 300 requests per minute per IP
- **Location API:** 60 requests per minute per IP
- **Nominatim Queue:** 1 request per second (prevents upstream API ban)

## Key Features

- **JWT Authentication** with 7-day token expiry
- **OTP Email Verification** via Gmail SMTP
- **Real-time messaging** via Socket.IO WebSocket
- **Haversine distance matching** within 5 km radius
- **In-memory caching** for geocoding results (1 hour TTL)
- **Rate limiting** on all routes with stricter limits on location API
- **Coin reward system** (driver: 1 coin/km, passenger: 0.5 coin/km)
