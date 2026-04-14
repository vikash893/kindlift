"""
KindLift ML — Correct Training Script

Your 'sentiment' column contains actual review TEXT, not labels.
This script uses TF-IDF to convert text into features the model can learn from.

Usage:
    python train_model.py

Output:
    models/rating_model_final.pkl
    models/tfidf_vectorizer.pkl
    models/target_encoder.pkl
"""

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# ---- Step 1: Load dataset ----
df = pd.read_csv(r'C:\Users\rajpu\Downloads\rating_data\ola_review_dataset.csv')
print(f"Dataset shape: {df.shape}")
print(f"Columns: {list(df.columns)}")

# ---- Step 2: Drop review_id and any NaN rows ----
df = df.drop('review_id', axis=1)
df = df.dropna(subset=['review_text', 'rating'])
print(f"After cleanup: {df.shape}")

# ---- Step 3: Simplify ratings to 3 groups ----
def simplify_rating(r):
    if r <= 2: return 'negative'
    elif r == 3: return 'neutral'
    else: return 'positive'

df['rating_group'] = df['rating'].apply(simplify_rating)
print("\nRating distribution:")
print(df['rating_group'].value_counts())

# ---- Step 4: Convert review TEXT to numbers using TF-IDF ----
tfidf = TfidfVectorizer(
    max_features=5000,    # Use top 5000 words
    stop_words='english', # Remove common words (the, is, at, etc.)
    ngram_range=(1, 2)    # Use single words and word pairs
)
X = tfidf.fit_transform(df['review_text'])  # review_text = actual review text
print(f"\nTF-IDF features: {X.shape[1]} words/phrases extracted")

# ---- Step 5: Encode target ----
le_target = LabelEncoder()
y = le_target.fit_transform(df['rating_group'])
print(f"Target classes: {list(le_target.classes_)}")

# ---- Step 6: Split 80/20 ----
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"\nTrain: {X_train.shape[0]} samples")
print(f"Test:  {X_test.shape[0]} samples")

# ---- Step 7: Train ----
print("\nTraining Random Forest... (this may take a minute)")
model = RandomForestClassifier(
    n_estimators=200,
    class_weight='balanced',
    random_state=42,
    n_jobs=-1  # Use all CPU cores for speed
)
model.fit(X_train, y_train)

# ---- Step 8: Evaluate ----
predictions = model.predict(X_test)
acc = accuracy_score(y_test, predictions)
print(f"\n{'='*50}")
print(f"Accuracy: {acc * 100:.1f}%")
print(f"{'='*50}")
print("\nDetailed Report:")
print(classification_report(y_test, predictions, target_names=le_target.classes_))

# ---- Step 9: Save everything ----
os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/rating_model_final.pkl')
joblib.dump(tfidf, 'models/tfidf_vectorizer.pkl')
joblib.dump(le_target, 'models/target_encoder.pkl')
print("[OK] All saved to models/ folder!")
print("     - rating_model_final.pkl")
print("     - tfidf_vectorizer.pkl")
print("     - target_encoder.pkl")
