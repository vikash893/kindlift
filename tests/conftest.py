"""
conftest.py — Shared Pytest Fixtures for KindLift Unit Tests

Provides reusable fixtures and helper factories that mirror the
backend's MongoDB document schemas (User, RideOffer, RideRequest,
Transaction) so that tests can run offline without a database.
"""

import pytest
import math
import hashlib
import hmac
import re
from datetime import datetime, timedelta, timezone


# ═══════════════════════════════════════════════════════════════
#  Haversine Distance (Python port of backend/utils/geocoder.js)
# ═══════════════════════════════════════════════════════════════

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate great-circle distance between two GPS points in kilometres.
    Mirrors the backend ``calculateDistance()`` in ``utils/geocoder.js``.
    """
    R = 6371  # Earth radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# ═══════════════════════════════════════════════════════════════
#  Coin Calculation (mirrors backend payment.js logic)
# ═══════════════════════════════════════════════════════════════

def calculate_coins(amount_inr: float) -> float:
    """Return coin count for an INR purchase.  ₹10 → 1 000 coins."""
    return (amount_inr / 10) * 1000


# ═══════════════════════════════════════════════════════════════
#  Razorpay Signature Verification (mirrors payment.js)
# ═══════════════════════════════════════════════════════════════

def verify_razorpay_signature(order_id: str, payment_id: str,
                              signature: str, secret: str) -> bool:
    """Replicates the HMAC-SHA256 signature check from payment.js."""
    message = f"{order_id}|{payment_id}"
    expected = hmac.new(
        secret.encode(), message.encode(), hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


# ═══════════════════════════════════════════════════════════════
#  Validation Helpers (mirror backend/middleware/validate.js)
# ═══════════════════════════════════════════════════════════════

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_email(email: str) -> bool:
    """Basic e-mail format check (mirrors express-validator isEmail)."""
    return bool(EMAIL_REGEX.match(email.strip()))


def validate_password(password: str) -> bool:
    """Password must be at least 6 characters."""
    return len(password) >= 6


def validate_name(name: str) -> bool:
    """Name must be 2–100 characters after trimming."""
    trimmed = name.strip()
    return 2 <= len(trimmed) <= 100


def validate_otp(otp: str) -> bool:
    """OTP must be exactly 6 numeric digits."""
    return len(otp) == 6 and otp.isdigit()


def validate_completion_code(code: str) -> bool:
    """Ride completion code must be exactly 4 numeric digits."""
    return len(code) == 4 and code.isdigit()


def validate_latitude(lat) -> bool:
    """Latitude must be a number between -90 and 90."""
    try:
        return -90 <= float(lat) <= 90
    except (TypeError, ValueError):
        return False


def validate_longitude(lng) -> bool:
    """Longitude must be a number between -180 and 180."""
    try:
        return -180 <= float(lng) <= 180
    except (TypeError, ValueError):
        return False


def validate_seats(seats) -> bool:
    """Seats must be an integer between 1 and 10."""
    try:
        s = int(seats)
        return 1 <= s <= 10
    except (TypeError, ValueError):
        return False


def validate_rating(rating) -> bool:
    """Rating must be an integer between 1 and 5."""
    try:
        r = int(rating)
        return 1 <= r <= 5
    except (TypeError, ValueError):
        return False


def simplify_rating(r: int) -> str:
    """Replicate ML training label logic: 1-2 → negative, 3 → neutral, 4-5 → positive."""
    if r <= 2:
        return "negative"
    elif r == 3:
        return "neutral"
    else:
        return "positive"


# ═══════════════════════════════════════════════════════════════
#  Factory Fixtures
# ═══════════════════════════════════════════════════════════════

@pytest.fixture
def sample_user():
    """Return a dict mimicking a MongoDB User document."""
    return {
        "_id": "665f1a2b3c4d5e6f7a8b9c0d",
        "name": "Vikash Kumar",
        "email": "vikash@example.com",
        "password": "$2b$10$hashedpasswordplaceholder",
        "phone": "9876543210",
        "profilePhoto": "",
        "isAdmin": False,
        "role": "user",
        "isDriverVerified": False,
        "driverVerificationStatus": "none",
        "coins": 0,
        "ratingSum": 0,
        "totalRatings": 0,
        "isActive": True,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }


@pytest.fixture
def verified_driver(sample_user):
    """A user who has been approved as a driver."""
    return {
        **sample_user,
        "_id": "665f1a2b3c4d5e6f7a8b9c0e",
        "name": "Rajesh Driver",
        "email": "rajesh.driver@example.com",
        "isDriverVerified": True,
        "driverVerificationStatus": "approved",
        "vehicleNumber": "DL01AB1234",
        "licenseNumber": "DL-1234567890",
        "vehiclePhoto": "base64encodedphoto",
    }


@pytest.fixture
def sample_ride_offer(verified_driver):
    """Return a dict mimicking a MongoDB RideOffer document."""
    return {
        "_id": "770a1b2c3d4e5f6a7b8c9d0e",
        "driverId": verified_driver["_id"],
        "source": {
            "name": "Connaught Place, Delhi",
            "lat": 28.6315,
            "lng": 77.2167,
        },
        "destination": {
            "name": "Gurugram Cyber Hub",
            "lat": 28.4945,
            "lng": 77.0888,
        },
        "seatsAvailable": 3,
        "departureTime": (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat(),
        "status": "waiting",
    }


@pytest.fixture
def sample_ride_request(sample_user, sample_ride_offer):
    """Return a dict mimicking a MongoDB RideRequest document."""
    return {
        "_id": "880b2c3d4e5f6a7b8c9d0e1f",
        "passengerId": sample_user["_id"],
        "offerId": sample_ride_offer["_id"],
        "seatsRequested": 1,
        "status": "pending",
        "source": {
            "name": "Rajiv Chowk Metro",
            "lat": 28.6328,
            "lng": 77.2197,
        },
        "destination": {
            "name": "HUDA City Centre",
            "lat": 28.4595,
            "lng": 77.0723,
        },
        "completionCode": "4782",
        "coinsCharged": 0,
        "isRatedByPassenger": False,
        "isRatedByDriver": False,
    }


@pytest.fixture
def sample_transaction(sample_user):
    """Return a dict mimicking a MongoDB Transaction document."""
    return {
        "_id": "990c3d4e5f6a7b8c9d0e1f2a",
        "userId": sample_user["_id"],
        "amount": 100,
        "coins": 10000,
        "paymentId": "pay_TESTABC123",
        "orderId": "order_TESTXYZ789",
        "status": "success",
    }
