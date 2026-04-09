import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_home():
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["message"].lower().startswith("lawbridge ai service")

def test_warmup():
    resp = client.get("/warmup")
    assert resp.status_code == 200
    assert resp.json()["status"] == "AI is ready"

def test_predict_short_text():
    resp = client.post("/predict", json={"text": "short"})
    assert resp.status_code == 422

def test_predict_long_text():
    long_text = "a" * 2100
    resp = client.post("/predict", json={"text": long_text})
    assert resp.status_code == 422

def test_predict_valid_minor():
    resp = client.post("/predict", json={"text": "I have a simple question about my rights."})
    assert resp.status_code == 200
    data = resp.json()
    assert "category" in data
    assert "severity" in data
    assert "solution" in data
    assert "legal_info" in data

def test_predict_valid_serious():
    resp = client.post("/predict", json={"text": "I am facing threats and harassment at work."})
    assert resp.status_code == 200
    data = resp.json()
    assert data["severity"].lower() == "serious" or "moderate" in data["severity"].lower()
    assert "legal_info" in data
    assert "solution" in data
