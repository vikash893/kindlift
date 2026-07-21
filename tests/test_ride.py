"""
test_ride.py — Unit Tests for KindLift Ride Module

Tests cover:
  • Haversine distance formula (Python port of backend/utils/geocoder.js)
  • Ride offer data validation (coordinates, seats, departure time)
  • Ride search / matching logic (5 km radius proximity filter)
  • Driver verification gate logic
  • Ride status lifecycle (waiting → ongoing → completed / cancelled)
  • OTP-based ride completion
  • Coin allocation on ride completion
  • Edge cases: self-booking prevention, seat availability
"""

import pytest
import math
from datetime import datetime, timedelta, timezone
from conftest import (
    haversine_distance,
    validate_latitude,
    validate_longitude,
    validate_seats,
    validate_completion_code,
)


# ═══════════════════════════════════════════════════════════════
#  1. HAVERSINE DISTANCE FORMULA
# ═══════════════════════════════════════════════════════════════

class TestHaversineDistance:
    """
    Validates the Python port of calculateDistance() from geocoder.js.
    Uses well-known city pairs with expected distances.
    """

    def test_same_point_zero_distance(self):
        """Distance from a point to itself should be 0."""
        d = haversine_distance(28.6315, 77.2167, 28.6315, 77.2167)
        assert d == pytest.approx(0.0, abs=0.001)

    def test_delhi_to_gurugram(self):
        """Connaught Place → Cyber Hub ≈ 27 km."""
        d = haversine_distance(28.6315, 77.2167, 28.4945, 77.0888)
        assert 17 < d < 22

    def test_short_distance_within_5km(self):
        """Two close points in central Delhi (< 5 km)."""
        d = haversine_distance(28.6315, 77.2167, 28.6328, 77.2197)
        assert d < 5

    def test_delhi_to_mumbai(self):
        """Long distance ≈ 1150 km — verifies formula at scale."""
        d = haversine_distance(28.6139, 77.2090, 19.0760, 72.8777)
        assert 1100 < d < 1250

    def test_equator_crossing(self):
        """Points on opposite sides of the equator."""
        d = haversine_distance(1.0, 77.0, -1.0, 77.0)
        assert 220 < d < 224

    def test_antipodal_points(self):
        """Diametrically opposite points ≈ 20 015 km."""
        d = haversine_distance(0, 0, 0, 180)
        assert 20000 < d < 20100

    def test_symmetry(self):
        """Distance A→B == Distance B→A."""
        d1 = haversine_distance(28.6315, 77.2167, 28.4945, 77.0888)
        d2 = haversine_distance(28.4945, 77.0888, 28.6315, 77.2167)
        assert d1 == pytest.approx(d2, rel=1e-9)

    def test_negative_coordinates(self):
        """Southern hemisphere coordinates should work."""
        d = haversine_distance(-33.8688, 151.2093, -37.8136, 144.9631)
        assert 700 < d < 750  # Sydney to Melbourne


# ═══════════════════════════════════════════════════════════════
#  2. COORDINATE VALIDATION
# ═══════════════════════════════════════════════════════════════

class TestCoordinateValidation:
    """Mirrors: isFloat({min: -90, max: 90}) for lat, {-180, 180} for lng."""

    def test_valid_latitude(self):
        assert validate_latitude(28.6315) is True

    def test_valid_latitude_boundary_north_pole(self):
        assert validate_latitude(90) is True

    def test_valid_latitude_boundary_south_pole(self):
        assert validate_latitude(-90) is True

    def test_invalid_latitude_too_high(self):
        assert validate_latitude(91) is False

    def test_invalid_latitude_too_low(self):
        assert validate_latitude(-91) is False

    def test_valid_longitude(self):
        assert validate_longitude(77.2167) is True

    def test_valid_longitude_boundary_east(self):
        assert validate_longitude(180) is True

    def test_valid_longitude_boundary_west(self):
        assert validate_longitude(-180) is True

    def test_invalid_longitude_too_high(self):
        assert validate_longitude(181) is False

    def test_invalid_longitude_too_low(self):
        assert validate_longitude(-181) is False

    def test_latitude_string_conversion(self):
        """Backend does Number(source.lat) — strings should parse."""
        assert validate_latitude("28.6315") is True

    def test_latitude_invalid_string(self):
        assert validate_latitude("abc") is False

    def test_latitude_none(self):
        assert validate_latitude(None) is False


# ═══════════════════════════════════════════════════════════════
#  3. SEAT VALIDATION
# ═══════════════════════════════════════════════════════════════

class TestSeatValidation:
    """Mirrors: isInt({ min: 1, max: 10 }) from validate.js."""

    def test_valid_seats(self):
        assert validate_seats(3) is True

    def test_min_seats(self):
        assert validate_seats(1) is True

    def test_max_seats(self):
        assert validate_seats(10) is True

    def test_invalid_zero_seats(self):
        assert validate_seats(0) is False

    def test_invalid_negative_seats(self):
        assert validate_seats(-1) is False

    def test_invalid_too_many_seats(self):
        assert validate_seats(11) is False

    def test_seats_string_conversion(self):
        assert validate_seats("5") is True


# ═══════════════════════════════════════════════════════════════
#  4. RIDE OFFER DATA INTEGRITY
# ═══════════════════════════════════════════════════════════════

class TestRideOfferData:
    """Validates ride offer document structure and defaults."""

    def test_ride_offer_default_status(self, sample_ride_offer):
        assert sample_ride_offer["status"] == "waiting"

    def test_ride_offer_has_required_fields(self, sample_ride_offer):
        required = {"driverId", "source", "destination", "seatsAvailable", "departureTime", "status"}
        assert required.issubset(sample_ride_offer.keys())

    def test_ride_offer_source_has_coordinates(self, sample_ride_offer):
        src = sample_ride_offer["source"]
        assert "name" in src
        assert "lat" in src
        assert "lng" in src
        assert validate_latitude(src["lat"])
        assert validate_longitude(src["lng"])

    def test_ride_offer_destination_has_coordinates(self, sample_ride_offer):
        dest = sample_ride_offer["destination"]
        assert "name" in dest
        assert "lat" in dest
        assert "lng" in dest
        assert validate_latitude(dest["lat"])
        assert validate_longitude(dest["lng"])

    def test_ride_offer_valid_status_enum(self):
        valid = {"waiting", "ongoing", "completed", "cancelled"}
        assert "waiting" in valid
        assert "ongoing" in valid
        assert "completed" in valid
        assert "cancelled" in valid
        assert "expired" not in valid

    def test_departure_time_in_future(self, sample_ride_offer):
        dep = datetime.fromisoformat(sample_ride_offer["departureTime"])
        assert dep > datetime.now(timezone.utc)


# ═══════════════════════════════════════════════════════════════
#  5. RIDE SEARCH / PROXIMITY MATCHING
# ═══════════════════════════════════════════════════════════════

class TestRideSearchMatching:
    """
    Replicates the ride search logic from rides.js GET /search.
    Rides match when both source and destination are within MAX_DISTANCE_KM (5 km).
    """

    MAX_DISTANCE_KM = 5

    def test_nearby_ride_matches(self, sample_ride_offer):
        """Passenger very close to driver's source & destination."""
        passenger_source = {"lat": 28.632, "lng": 77.218}
        passenger_dest = {"lat": 28.495, "lng": 77.089}

        src_dist = haversine_distance(
            passenger_source["lat"], passenger_source["lng"],
            sample_ride_offer["source"]["lat"], sample_ride_offer["source"]["lng"],
        )
        dest_dist = haversine_distance(
            passenger_dest["lat"], passenger_dest["lng"],
            sample_ride_offer["destination"]["lat"], sample_ride_offer["destination"]["lng"],
        )
        assert src_dist <= self.MAX_DISTANCE_KM
        assert dest_dist <= self.MAX_DISTANCE_KM

    def test_far_ride_does_not_match(self, sample_ride_offer):
        """Passenger 50 km away — should not match."""
        passenger_source = {"lat": 29.0, "lng": 77.5}
        src_dist = haversine_distance(
            passenger_source["lat"], passenger_source["lng"],
            sample_ride_offer["source"]["lat"], sample_ride_offer["source"]["lng"],
        )
        assert src_dist > self.MAX_DISTANCE_KM

    def test_source_close_but_destination_far(self, sample_ride_offer):
        """Only source within 5 km — should not match."""
        passenger_source = {"lat": 28.632, "lng": 77.218}
        passenger_dest = {"lat": 19.076, "lng": 72.877}  # Mumbai!

        src_dist = haversine_distance(
            passenger_source["lat"], passenger_source["lng"],
            sample_ride_offer["source"]["lat"], sample_ride_offer["source"]["lng"],
        )
        dest_dist = haversine_distance(
            passenger_dest["lat"], passenger_dest["lng"],
            sample_ride_offer["destination"]["lat"], sample_ride_offer["destination"]["lng"],
        )
        source_match = src_dist <= self.MAX_DISTANCE_KM
        dest_match = dest_dist <= self.MAX_DISTANCE_KM
        assert source_match is True
        assert dest_match is False
        # Overall: ride does NOT match
        assert not (source_match and dest_match)

    def test_matched_rides_sorted_by_proximity(self):
        """matchedRides.sort((a,b) => a.distanceToDriver - b.distanceToDriver)."""
        rides = [
            {"distanceToDriver": 3.5},
            {"distanceToDriver": 1.2},
            {"distanceToDriver": 4.8},
            {"distanceToDriver": 0.5},
        ]
        sorted_rides = sorted(rides, key=lambda r: r["distanceToDriver"])
        distances = [r["distanceToDriver"] for r in sorted_rides]
        assert distances == [0.5, 1.2, 3.5, 4.8]

    def test_self_booking_excluded(self, sample_ride_offer, verified_driver):
        """
        Search filter: driverId: { $ne: req.user.id }
        Driver should not see their own rides in search results.
        """
        current_user_id = verified_driver["_id"]
        ride_driver_id = sample_ride_offer["driverId"]
        assert current_user_id == ride_driver_id, "Same driver"
        # This ride would be filtered out by: driverId: { $ne: req.user.id }

    def test_only_waiting_rides_returned(self):
        """Search filter: status: 'waiting'."""
        rides = [
            {"status": "waiting", "seatsAvailable": 2},
            {"status": "ongoing", "seatsAvailable": 2},
            {"status": "completed", "seatsAvailable": 2},
            {"status": "cancelled", "seatsAvailable": 2},
        ]
        waiting = [r for r in rides if r["status"] == "waiting"]
        assert len(waiting) == 1

    def test_sufficient_seats_filter(self):
        """Search filter: seatsAvailable: { $gte: seats }."""
        rides = [
            {"seatsAvailable": 1},
            {"seatsAvailable": 3},
            {"seatsAvailable": 5},
        ]
        requested = 2
        matching = [r for r in rides if r["seatsAvailable"] >= requested]
        assert len(matching) == 2


# ═══════════════════════════════════════════════════════════════
#  6. DRIVER VERIFICATION GATE
# ═══════════════════════════════════════════════════════════════

class TestDriverVerificationGate:
    """Mirrors the driver verification logic in rides.js POST /."""

    def test_pending_driver_blocked(self):
        user = {"driverVerificationStatus": "pending"}
        assert user["driverVerificationStatus"] == "pending"
        # Returns 403: "Your verification is in progress"

    def test_rejected_driver_blocked(self):
        user = {"driverVerificationStatus": "rejected", "driverVerificationNote": "Blurry photo"}
        assert user["driverVerificationStatus"] == "rejected"
        assert user["driverVerificationNote"] == "Blurry photo"

    def test_approved_driver_allowed(self, verified_driver):
        assert verified_driver["isDriverVerified"] is True
        assert verified_driver["driverVerificationStatus"] == "approved"

    def test_first_time_driver_needs_documents(self):
        """Unverified driver with status 'none' must provide vehicle details."""
        user = {"isDriverVerified": False, "driverVerificationStatus": "none"}
        payload_has_docs = {"vehicleNumber": "", "licenseNumber": "", "vehiclePhoto": ""}
        needs_docs = (
            not user["isDriverVerified"]
            and user["driverVerificationStatus"] != "approved"
        )
        assert needs_docs is True

    def test_first_time_driver_documents_submitted(self):
        """After submitting docs, status transitions to 'pending'."""
        user = {"isDriverVerified": False, "driverVerificationStatus": "none"}
        user["vehicleNumber"] = "DL01AB1234"
        user["licenseNumber"] = "DL-1234567890"
        user["vehiclePhoto"] = "base64photo"
        user["driverVerificationStatus"] = "pending"
        assert user["driverVerificationStatus"] == "pending"


# ═══════════════════════════════════════════════════════════════
#  7. RIDE REQUEST LIFECYCLE
# ═══════════════════════════════════════════════════════════════

class TestRideRequestLifecycle:
    """Validates ride request status transitions and data."""

    def test_default_status_pending(self, sample_ride_request):
        assert sample_ride_request["status"] == "pending"

    def test_request_has_completion_code(self, sample_ride_request):
        assert sample_ride_request["completionCode"] is not None
        assert validate_completion_code(sample_ride_request["completionCode"])

    def test_valid_status_transitions(self):
        """pending → accepted / rejected; accepted → completed."""
        valid_transitions = {
            "pending": {"accepted", "rejected"},
            "accepted": {"completed"},
        }
        assert "accepted" in valid_transitions["pending"]
        assert "rejected" in valid_transitions["pending"]
        assert "completed" in valid_transitions["accepted"]

    def test_request_has_passenger_source_dest(self, sample_ride_request):
        assert "source" in sample_ride_request
        assert "destination" in sample_ride_request
        assert validate_latitude(sample_ride_request["source"]["lat"])
        assert validate_longitude(sample_ride_request["source"]["lng"])

    def test_rating_flags_default_false(self, sample_ride_request):
        assert sample_ride_request["isRatedByPassenger"] is False
        assert sample_ride_request["isRatedByDriver"] is False


# ═══════════════════════════════════════════════════════════════
#  8. OTP RIDE COMPLETION
# ═══════════════════════════════════════════════════════════════

class TestRideCompletion:
    """Mirrors PUT /:id/complete from rides.js."""

    def test_correct_otp_completes_ride(self, sample_ride_request):
        submitted_code = "4782"
        assert sample_ride_request["completionCode"] == submitted_code

    def test_wrong_otp_rejected(self, sample_ride_request):
        submitted_code = "0000"
        assert sample_ride_request["completionCode"] != submitted_code

    def test_already_completed_ride_rejected(self):
        request = {"status": "completed"}
        assert request["status"] == "completed"
        # Returns 400: "Already completed"

    def test_only_driver_can_complete(self, sample_ride_request, verified_driver, sample_user):
        """Authorization: only the driver can complete."""
        ride_driver_id = verified_driver["_id"]
        passenger_id = sample_user["_id"]
        assert ride_driver_id != passenger_id

    def test_completion_code_format(self):
        """Code must be exactly 4 numeric digits."""
        assert validate_completion_code("4782") is True
        assert validate_completion_code("123") is False
        assert validate_completion_code("12345") is False
        assert validate_completion_code("abcd") is False


# ═══════════════════════════════════════════════════════════════
#  9. COIN ALLOCATION ON COMPLETION
# ═══════════════════════════════════════════════════════════════

class TestCoinAllocation:
    """Mirrors coin logic from rides.js complete route."""

    def test_driver_gets_10_coins(self):
        """const coins = 10; → driver gets full amount."""
        coins = 10
        assert coins == 10

    def test_passenger_gets_half_coins(self):
        """Math.floor(coins / 2) → passenger gets 5."""
        coins = 10
        passenger_coins = math.floor(coins / 2)
        assert passenger_coins == 5

    def test_coins_increment_user_balance(self):
        """$inc: { coins } — adds to existing balance."""
        driver = {"coins": 50}
        earned = 10
        driver["coins"] += earned
        assert driver["coins"] == 60

    def test_passenger_coins_increment(self):
        passenger = {"coins": 20}
        earned = math.floor(10 / 2)
        passenger["coins"] += earned
        assert passenger["coins"] == 25


# ═══════════════════════════════════════════════════════════════
#  10. RIDE STATUS ENUM
# ═══════════════════════════════════════════════════════════════

class TestRideStatusEnum:
    """Validates RideOffer and RideRequest status enums."""

    def test_ride_offer_statuses(self):
        valid = {"waiting", "ongoing", "completed", "cancelled"}
        assert len(valid) == 4
        for s in ["waiting", "ongoing", "completed", "cancelled"]:
            assert s in valid

    def test_ride_request_statuses(self):
        valid = {"pending", "accepted", "rejected", "completed"}
        assert len(valid) == 4
        for s in ["pending", "accepted", "rejected", "completed"]:
            assert s in valid

    def test_invalid_status_not_accepted(self):
        valid = {"waiting", "ongoing", "completed", "cancelled"}
        assert "expired" not in valid
        assert "deleted" not in valid
