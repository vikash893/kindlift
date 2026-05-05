"""
KindLift ML Service - Rating Sentiment Prediction API

A lightweight Flask microservice that serves the trained
Random Forest model for predicting ride rating sentiment
(positive / neutral / negative) from review text.

Usage:
    python app.py

Endpoints:
    POST /predict  - Predict sentiment from review text
    GET  /health   - Health check
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)

# Allow requests from your Express backend (local + deployed)
CORS(app, origins=[
    'http://localhost:8000',
    'http://localhost:3000',
    'https://kindlift-1.onrender.com',
    'https://kindlift.onrender.com',
    'https://kindlift.in',
    'https://www.kindlift.in',
])

# --- Load Model & Encoders ---
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

try:
    model = joblib.load(os.path.join(MODEL_DIR, 'rating_model_final.pkl'))
    tfidf = joblib.load(os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl'))
    le_target = joblib.load(os.path.join(MODEL_DIR, 'target_encoder.pkl'))
    print("[OK] Model and encoders loaded successfully!")
    print(f"   Target classes: {list(le_target.classes_)}")
    print(f"   TF-IDF features: {len(tfidf.vocabulary_)}")
except Exception as e:
    print(f"[ERROR] Error loading model: {e}")
    print("   Make sure .pkl files are in the 'models/' folder")
    model = None


# --- Routes ---

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict rating sentiment from review text.

    Request Body:
        { "review": "the driver was very friendly and helpful" }

    Response:
        {
            "predicted_sentiment": "positive",
            "confidence": "high",
            "confidence_score": 0.85,
            "input": "the driver was very friendly and helpful"
        }
    """
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    data = request.json
    if not data or 'review' not in data:
        return jsonify({'error': 'Missing "review" field in request body'}), 400

    review_text = data['review'].strip()

    if not review_text:
        return jsonify({'error': 'Review text cannot be empty'}), 400

    try:
        # Convert text to TF-IDF features -> Predict -> Decode
        text_features = tfidf.transform([review_text])
        prediction = model.predict(text_features)
        probabilities = model.predict_proba(text_features)[0]
        result = le_target.inverse_transform(prediction)[0]

        # Get confidence level
        max_prob = max(probabilities)
        confidence = 'high' if max_prob > 0.7 else 'medium' if max_prob > 0.5 else 'low'

        return jsonify({
            'predicted_sentiment': result,
            'confidence': confidence,
            'confidence_score': round(float(max_prob), 3),
            'input': review_text
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# --- Main ---

if __name__ == '__main__':
    # Render sets PORT env var; fall back to ML_PORT or 5001 for local dev
    port = int(os.environ.get('PORT', os.environ.get('ML_PORT', 5001)))
    is_production = os.environ.get('RENDER', '') == 'true' or os.environ.get('PORT')
    print(f"\nKindLift ML Service running on http://localhost:{port}")
    print(f"   POST /predict  - Predict sentiment from review text")
    print(f"   GET  /health   - Health check")
    print(f"   Environment: {'production' if is_production else 'development'}\n")
    app.run(host='0.0.0.0', port=port, debug=not is_production, use_reloader=False)
