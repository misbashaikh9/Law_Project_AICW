import pandas as pd
from sklearn.pipeline import FeatureUnion
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

import joblib
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np
def print_confusion_matrix(y_true, y_pred, labels, title):
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    print(f"\n{title} Confusion Matrix:")
    print("Labels:", labels)
    print(cm)

# Call the function after predictions and reports
# (This ensures the function is actually executed)


# Move confusion matrix code after predictions are made

# ─────────────────────────────────────────────
# Load dataset
# ─────────────────────────────────────────────
data = pd.read_csv("data.csv")

texts = data["text"].astype(str).str.lower().str.strip()
y_category = data["category"]
y_severity = data["severity"]

X_train, X_test, y_cat_train, y_cat_test, y_sev_train, y_sev_test = train_test_split(
    texts, y_category, y_severity, test_size=0.2, random_state=42
)

# ─────────────────────────────────────────────
# Feature Engineering 
# Combine word features with character features so the model is less fragile
# when users type short, misspelled, or informal queries.
# ─────────────────────────────────────────────
vectorizer = FeatureUnion([
    (
        "word",
        TfidfVectorizer(
            lowercase=True,
            stop_words="english",
            ngram_range=(1, 2),
            sublinear_tf=True,
            max_features=8000,
        ),
    ),
    (
        "char",
        TfidfVectorizer(
            lowercase=True,
            analyzer="char_wb",
            ngram_range=(3, 5),
            sublinear_tf=True,
            max_features=8000
        ),
    ),
])

# Fit only on training data
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# ─────────────────────────────────────────────
# Train Models
# ─────────────────────────────────────────────
category_model = MultinomialNB(alpha=0.5)
severity_model = MultinomialNB(alpha=0.5)

category_model.fit(X_train_vec, y_cat_train)
severity_model.fit(X_train_vec, y_sev_train)

# ─────────────────────────────────────────────
# Evaluate (for YOU, not UI)
# ─────────────────────────────────────────────

cat_preds = category_model.predict(X_test_vec)
sev_preds = severity_model.predict(X_test_vec)

cat_acc = accuracy_score(y_cat_test, cat_preds)
sev_acc = accuracy_score(y_sev_test, sev_preds)

print(f"Category Accuracy: {cat_acc:.2f}")
print(f"Severity Accuracy: {sev_acc:.2f}")


print("\nCategory Classification Report:")
print(classification_report(y_cat_test, cat_preds))

print("Severity Classification Report:")
print(classification_report(y_sev_test, sev_preds))

# Print confusion matrices for both category and severity
cat_labels = np.unique(y_cat_test)
sev_labels = np.unique(y_sev_test)
print_confusion_matrix(y_cat_test, cat_preds, cat_labels, "Category")
print_confusion_matrix(y_sev_test, sev_preds, sev_labels, "Severity")

# ─────────────────────────────────────────────
# Save Models (clean way)
# ─────────────────────────────────────────────
joblib.dump(vectorizer, "vectorizer.pkl")
joblib.dump(category_model, "category_model.pkl")
joblib.dump(severity_model, "severity_model.pkl")

print("Models trained and saved!")

# ─────────────────────────────────────────────
# Lawyer Data Processing (safe version)
# ─────────────────────────────────────────────

# Robust lawyer.csv loading: handle header or no header, clean numeric fields
try:
    lawyer_df = pd.read_csv(
        "lawyer.csv",
        header=0,
        names=[
            "name", "specialization", "location",
            "experience", "rating", "fees",
            "cases", "lost_cases", "qualification", "contact"
        ]
    )
except pd.errors.ParserError:
    # Fallback: try without header
    lawyer_df = pd.read_csv(
        "lawyer.csv",
        header=None,
        names=[
            "name", "specialization", "location",
            "experience", "rating", "fees",
            "cases", "lost_cases", "qualification", "contact"
        ]
    )

# Clean numeric fields (robust to bad data)
for col in ["experience", "rating", "cases", "lost_cases"]:
    lawyer_df[col] = pd.to_numeric(lawyer_df[col], errors="coerce").fillna(0).astype(int)

# Convert to list of dicts
lawyer_list = lawyer_df.fillna("").to_dict(orient="records")
# Save safely
joblib.dump(lawyer_list, "lawyers.pkl")

print("Lawyer data processed and saved as lawyers.pkl!")