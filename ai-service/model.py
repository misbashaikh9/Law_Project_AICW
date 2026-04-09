import joblib

vectorizer = joblib.load("vectorizer.pkl")
category_model = joblib.load("category_model.pkl")
severity_model = joblib.load("severity_model.pkl")

def clean_text(text):
    return text.lower().strip()

def predict_text(text):
    if not text or text.strip() == "":
        return "Invalid input", "Unknown"

    text = clean_text(text)
    X = vectorizer.transform([text])

    category = category_model.predict(X)[0]
    severity = severity_model.predict(X)[0]

    category_prob = category_model.predict_proba(X).max()
    severity_prob = severity_model.predict_proba(X).max()

    return category, severity, category_prob, severity_prob