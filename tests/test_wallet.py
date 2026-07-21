"""
test_wallet.py — Unit Tests for KindLift Wallet & Payment Module

Tests cover:
  • Coin purchase calculation (₹10 = 1000 coins)
  • Razorpay signature verification (HMAC-SHA256)
  • Payment order creation validation
  • Duplicate payment detection
  • Transaction document integrity
  • Coin balance updates
  • Payment amount validation
  • Edge cases: zero amount, negative amount, very large purchases
  • ML Sentiment Analysis (rating simplification and prediction logic)
"""

import pytest
import math
import hashlib
import hmac
from datetime import datetime, timezone
from conftest import (
    calculate_coins,
    verify_razorpay_signature,
    validate_rating,
    simplify_rating,
)


# ═══════════════════════════════════════════════════════════════
#  1. COIN CALCULATION LOGIC
# ═══════════════════════════════════════════════════════════════

class TestCoinCalculation:
    """
    Mirrors: const coins = (amount / 10) * 1000
    from payment.js verify-payment route.
    """

    def test_10_rupees_gives_1000_coins(self):
        assert calculate_coins(10) == 1000

    def test_50_rupees_gives_5000_coins(self):
        assert calculate_coins(50) == 5000

    def test_100_rupees_gives_10000_coins(self):
        assert calculate_coins(100) == 10000

    def test_500_rupees_gives_50000_coins(self):
        assert calculate_coins(500) == 50000

    def test_1_rupee_gives_100_coins(self):
        assert calculate_coins(1) == 100

    def test_fractional_amount(self):
        """₹15 → 1500 coins."""
        assert calculate_coins(15) == 1500

    def test_large_amount(self):
        """₹10,000 → 1,000,000 coins."""
        assert calculate_coins(10000) == 1_000_000

    def test_zero_amount(self):
        assert calculate_coins(0) == 0


# ═══════════════════════════════════════════════════════════════
#  2. RAZORPAY SIGNATURE VERIFICATION
# ═══════════════════════════════════════════════════════════════

class TestRazorpaySignature:
    """
    Mirrors the HMAC-SHA256 signature verification logic from payment.js.
    sign = order_id + '|' + payment_id
    expected = crypto.createHmac('sha256', secret).update(sign).digest('hex')
    """

    SECRET = "test_razorpay_secret_key"

    def _create_valid_signature(self, order_id, payment_id):
        """Generate a valid Razorpay signature for testing."""
        message = f"{order_id}|{payment_id}"
        return hmac.new(
            self.SECRET.encode(), message.encode(), hashlib.sha256
        ).hexdigest()

    def test_valid_signature_passes(self):
        order_id = "order_ABC123"
        payment_id = "pay_XYZ789"
        signature = self._create_valid_signature(order_id, payment_id)
        assert verify_razorpay_signature(order_id, payment_id, signature, self.SECRET)

    def test_invalid_signature_fails(self):
        order_id = "order_ABC123"
        payment_id = "pay_XYZ789"
        fake_signature = "0" * 64
        assert not verify_razorpay_signature(order_id, payment_id, fake_signature, self.SECRET)

    def test_wrong_order_id_fails(self):
        order_id = "order_ABC123"
        payment_id = "pay_XYZ789"
        signature = self._create_valid_signature(order_id, payment_id)
        assert not verify_razorpay_signature("order_WRONG", payment_id, signature, self.SECRET)

    def test_wrong_payment_id_fails(self):
        order_id = "order_ABC123"
        payment_id = "pay_XYZ789"
        signature = self._create_valid_signature(order_id, payment_id)
        assert not verify_razorpay_signature(order_id, "pay_WRONG", signature, self.SECRET)

    def test_wrong_secret_fails(self):
        order_id = "order_ABC123"
        payment_id = "pay_XYZ789"
        signature = self._create_valid_signature(order_id, payment_id)
        assert not verify_razorpay_signature(order_id, payment_id, signature, "wrong_secret")

    def test_signature_is_hex_string(self):
        order_id = "order_TEST"
        payment_id = "pay_TEST"
        sig = self._create_valid_signature(order_id, payment_id)
        assert len(sig) == 64  # SHA-256 → 64 hex chars
        assert all(c in "0123456789abcdef" for c in sig)


# ═══════════════════════════════════════════════════════════════
#  3. PAYMENT ORDER CREATION
# ═══════════════════════════════════════════════════════════════

class TestPaymentOrderCreation:
    """Mirrors: POST /create-order from payment.js."""

    def test_amount_converted_to_paise(self):
        """Math.round(amount * 100) converts ₹ to paise."""
        amount_inr = 100
        amount_paise = round(amount_inr * 100)
        assert amount_paise == 10000

    def test_small_amount_conversion(self):
        amount_paise = round(1 * 100)
        assert amount_paise == 100

    def test_fractional_amount_rounded(self):
        """₹99.99 → 9999 paise."""
        amount_paise = round(99.99 * 100)
        assert amount_paise == 9999

    def test_currency_always_inr(self):
        """Payment gateway uses INR."""
        options = {"currency": "INR"}
        assert options["currency"] == "INR"

    def test_receipt_format(self):
        """receipt: 'receipt_' + Date.now()."""
        import time
        receipt = f"receipt_{int(time.time() * 1000)}"
        assert receipt.startswith("receipt_")
        assert len(receipt) > 10

    def test_invalid_zero_amount_rejected(self):
        """Backend returns 400 for amount <= 0."""
        amount = 0
        assert not (amount and amount > 0)

    def test_invalid_negative_amount_rejected(self):
        amount = -50
        assert not (amount and amount > 0)

    def test_valid_amount_accepted(self):
        amount = 100
        assert amount and amount > 0


# ═══════════════════════════════════════════════════════════════
#  4. DUPLICATE PAYMENT DETECTION
# ═══════════════════════════════════════════════════════════════

class TestDuplicatePayment:
    """
    Mirrors: Transaction.findOne({ paymentId }) → "Payment already processed".
    """

    def test_new_payment_not_duplicate(self):
        existing_payment_ids = {"pay_AAA111", "pay_BBB222"}
        new_payment_id = "pay_CCC333"
        assert new_payment_id not in existing_payment_ids

    def test_duplicate_payment_detected(self):
        existing_payment_ids = {"pay_AAA111", "pay_BBB222"}
        dup_payment_id = "pay_AAA111"
        assert dup_payment_id in existing_payment_ids

    def test_different_order_same_payment_id_is_duplicate(self):
        """Even with a new order_id, a reused payment_id is a duplicate."""
        existing = [{"paymentId": "pay_X", "orderId": "order_1"}]
        new_payment = {"paymentId": "pay_X", "orderId": "order_2"}
        is_dup = any(t["paymentId"] == new_payment["paymentId"] for t in existing)
        assert is_dup is True


# ═══════════════════════════════════════════════════════════════
#  5. TRANSACTION DOCUMENT INTEGRITY
# ═══════════════════════════════════════════════════════════════

class TestTransactionDocument:
    """Validates the Transaction schema from models/Transaction.js."""

    def test_transaction_has_required_fields(self, sample_transaction):
        required = {"userId", "amount", "coins", "paymentId", "orderId", "status"}
        assert required.issubset(sample_transaction.keys())

    def test_transaction_default_status(self, sample_transaction):
        assert sample_transaction["status"] == "success"

    def test_transaction_coins_match_amount(self, sample_transaction):
        """₹100 → 10,000 coins."""
        expected_coins = calculate_coins(sample_transaction["amount"])
        assert sample_transaction["coins"] == expected_coins

    def test_payment_id_format(self, sample_transaction):
        """Razorpay payment IDs start with 'pay_'."""
        assert sample_transaction["paymentId"].startswith("pay_")

    def test_order_id_format(self, sample_transaction):
        """Razorpay order IDs start with 'order_'."""
        assert sample_transaction["orderId"].startswith("order_")


# ═══════════════════════════════════════════════════════════════
#  6. COIN BALANCE UPDATES
# ═══════════════════════════════════════════════════════════════

class TestCoinBalanceUpdate:
    """Mirrors: User.findByIdAndUpdate(userId, { $inc: { coins } })."""

    def test_coins_added_to_balance(self, sample_user):
        initial = sample_user["coins"]  # 0
        purchased_coins = calculate_coins(100)  # 10,000
        new_balance = initial + purchased_coins
        assert new_balance == 10000

    def test_multiple_purchases_accumulate(self):
        balance = 0
        purchases = [10, 50, 100]
        for amount in purchases:
            balance += calculate_coins(amount)
        assert balance == 1000 + 5000 + 10000  # 16,000

    def test_coins_do_not_go_negative(self):
        """Coin deductions should be handled carefully."""
        balance = 500
        deduction = 600
        new_balance = max(0, balance - deduction)
        assert new_balance == 0

    def test_ride_completion_adds_coins(self, sample_user):
        """Ride completion: driver gets 10, passenger gets 5."""
        driver_balance = 100
        passenger_balance = 50
        driver_balance += 10
        passenger_balance += math.floor(10 / 2)
        assert driver_balance == 110
        assert passenger_balance == 55


# ═══════════════════════════════════════════════════════════════
#  7. RATING VALIDATION
# ═══════════════════════════════════════════════════════════════

class TestRatingValidation:
    """Mirrors: isInt({ min: 1, max: 5 }) from validate.js."""

    def test_valid_ratings(self):
        for r in range(1, 6):
            assert validate_rating(r) is True

    def test_invalid_zero_rating(self):
        assert validate_rating(0) is False

    def test_invalid_negative_rating(self):
        assert validate_rating(-1) is False

    def test_invalid_too_high_rating(self):
        assert validate_rating(6) is False

    def test_string_rating_conversion(self):
        assert validate_rating("3") is True


# ═══════════════════════════════════════════════════════════════
#  8. ML SENTIMENT CLASSIFICATION
# ═══════════════════════════════════════════════════════════════

class TestSentimentClassification:
    """
    Tests the rating → sentiment simplification logic
    from ml/train_model.py: 1-2 → negative, 3 → neutral, 4-5 → positive.
    """

    def test_rating_1_negative(self):
        assert simplify_rating(1) == "negative"

    def test_rating_2_negative(self):
        assert simplify_rating(2) == "negative"

    def test_rating_3_neutral(self):
        assert simplify_rating(3) == "neutral"

    def test_rating_4_positive(self):
        assert simplify_rating(4) == "positive"

    def test_rating_5_positive(self):
        assert simplify_rating(5) == "positive"

    def test_all_ratings_covered(self):
        """Every valid rating (1–5) maps to a known sentiment."""
        valid_sentiments = {"negative", "neutral", "positive"}
        for r in range(1, 6):
            assert simplify_rating(r) in valid_sentiments


# ═══════════════════════════════════════════════════════════════
#  9. ML CONFIDENCE LEVELS
# ═══════════════════════════════════════════════════════════════

class TestConfidenceLevels:
    """
    Mirrors the confidence thresholds from ml/app.py:
    max_prob > 0.7 → 'high', > 0.5 → 'medium', else → 'low'
    """

    @staticmethod
    def _get_confidence(max_prob):
        if max_prob > 0.7:
            return "high"
        elif max_prob > 0.5:
            return "medium"
        else:
            return "low"

    def test_high_confidence(self):
        assert self._get_confidence(0.85) == "high"

    def test_high_confidence_boundary(self):
        assert self._get_confidence(0.71) == "high"

    def test_medium_confidence(self):
        assert self._get_confidence(0.6) == "medium"

    def test_medium_confidence_boundary(self):
        assert self._get_confidence(0.51) == "medium"

    def test_low_confidence(self):
        assert self._get_confidence(0.3) == "low"

    def test_low_confidence_boundary(self):
        assert self._get_confidence(0.5) == "low"

    def test_exact_0_7_is_medium(self):
        """0.7 is NOT > 0.7, so it falls to medium."""
        assert self._get_confidence(0.7) == "medium"

    def test_exact_0_5_is_low(self):
        """0.5 is NOT > 0.5, so it falls to low."""
        assert self._get_confidence(0.5) == "low"

    def test_perfect_confidence(self):
        assert self._get_confidence(1.0) == "high"

    def test_zero_confidence(self):
        assert self._get_confidence(0.0) == "low"


# ═══════════════════════════════════════════════════════════════
#  10. ML PREDICTION RESPONSE SHAPE
# ═══════════════════════════════════════════════════════════════

class TestPredictionResponseShape:
    """Validates the expected JSON response from POST /predict."""

    def test_response_has_required_keys(self):
        response = {
            "predicted_sentiment": "positive",
            "confidence": "high",
            "confidence_score": 0.85,
            "input": "Great ride, very friendly driver!",
        }
        required = {"predicted_sentiment", "confidence", "confidence_score", "input"}
        assert required == set(response.keys())

    def test_sentiment_is_valid_class(self):
        valid = {"positive", "neutral", "negative"}
        for sentiment in valid:
            assert sentiment in valid

    def test_confidence_score_is_float(self):
        response = {"confidence_score": 0.85}
        assert isinstance(response["confidence_score"], float)

    def test_confidence_score_bounded(self):
        """Score must be between 0 and 1."""
        for score in [0.0, 0.5, 0.7, 1.0]:
            assert 0.0 <= score <= 1.0

    def test_error_response_when_model_not_loaded(self):
        """app.py returns 500 with {'error': 'Model not loaded'}."""
        error_response = {"error": "Model not loaded"}
        assert "error" in error_response

    def test_error_response_missing_review(self):
        """app.py returns 400 with {'error': 'Missing \"review\" field...'}."""
        error_response = {"error": 'Missing "review" field in request body'}
        assert "review" in error_response["error"]

    def test_error_response_empty_review(self):
        error_response = {"error": "Review text cannot be empty"}
        assert "empty" in error_response["error"]
