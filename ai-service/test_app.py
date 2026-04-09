import pytest
from app import detect_intent, generate_solution

# --- Test intent detection logic ---
def test_detect_intent_email():
    assert detect_intent("I want a refund for a wrong product") == "email"
    assert detect_intent("I was charged twice for payment") == "email"

def test_detect_intent_communication():
    assert detect_intent("The company is not responding to my emails") == "communication"
    assert detect_intent("There is a delay in service") == "communication"

def test_detect_intent_serious():
    assert detect_intent("This is a case of fraud and harassment") == "serious"
    assert detect_intent("I am facing threats and violence") == "serious"

def test_detect_intent_general():
    assert detect_intent("I have a question about my rights") == "general"

# --- Test solution generation logic ---
def test_generate_solution_serious():
    result = generate_solution("I am facing threats", "criminal", "serious")
    assert "serious legal issue" in result
    assert "consult a lawyer" in result

def test_generate_solution_email():
    result = generate_solution("I want a refund", "consumer", "moderate")
    assert "formal complaint email" in result or "simple complaint email" in result

def test_generate_solution_communication():
    result = generate_solution("not responding", "service", "moderate")
    assert "directly contacting" in result or "communication" in result

def test_generate_solution_minor():
    result = generate_solution("general question", "info", "minor")
    assert "minor issue" in result
    assert "resolved easily" in result
