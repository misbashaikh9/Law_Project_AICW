from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError
from model import predict_text
import joblib
import os
from pathlib import Path
import httpx
from dotenv import load_dotenv
import logging
# here is the minor cases data
import csv

minor_cases = []

try:
    with open("minor_cases.csv", newline='', encoding="utf-8") as f:
        reader = csv.DictReader(f)
        minor_cases = list(reader)
except Exception as e:
    print("Error loading minor_cases.csv:", e)
# end of minor cases data
# Load lawyer data at startup
try:
    lawyers = joblib.load("lawyers.pkl")
    print("Total lawyers loaded:", len(lawyers))
    print("Sample lawyer:", lawyers[0] if lawyers else "EMPTY")

except Exception as e:
    print(f"Could not load lawyers.pkl: {e}")
    lawyers = []


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("lawbridge-ai-service")

# Load ai-service/.env first, then repo backend/.env (Groq key often lives with Node env).
_root = Path(__file__).resolve().parent
load_dotenv(_root / ".env")
load_dotenv(_root.parent / "backend" / ".env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq: use env vars. Model llama3-70b-8192 was retired — use a current ID (see Groq docs).
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")


# ── Request body ───────────────────────────────────────────────────────────────
class InputText(BaseModel):
    """
    Request body for legal query prediction.
    """
    text: str = Field(..., min_length=10, max_length=2000, description="User legal query (10-2000 chars)")


# ── Prompt builder ─────────────────────────────────────────────────────────────
def recommend_lawyers(category, severity, top_n=3):
    category = category.strip().lower()
    severity = severity.strip().lower()

    ranked = []

    for l in lawyers:
        spec = str(l.get("specialization", "")).strip().lower()

        if spec == category:
            try:
                rating = float(l.get("rating", 0))
                experience = int(l.get("experience", 0))
                cases = int(l.get("cases", 0))
                lost = int(l.get("lost_cases", 0))
                solved = cases - lost
            except:
                rating, experience, cases, lost, solved = 0, 0, 0, 0, 0

            # 🔥 improved score
            score = (
                (rating * 3) +
                (experience * 1.5) +
                (solved * 0.2) -
                (lost * 0.1)
            )

            # 🚨 serious boost
            if severity == "serious":
                score += 10

            ranked.append((score, l))

    ranked.sort(key=lambda x: x[0], reverse=True)

    return [l for _, l in ranked[:top_n]]


# ── Groq API call ──────────────────────────────────────────────────────────────

# Async Groq API call
async def call_groq(prompt: str) -> str:
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set (add it to ai-service/.env or the environment).")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are LawBridge AI, a professional Indian legal assistant. "
                    "Always respond in the exact structured format requested. "
                    "Use plain English. Do not use markdown or asterisks."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.4,
        "max_tokens": 1200,
    }

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(GROQ_URL, headers=headers, json=payload)
        if response.status_code != 200:
            try:
                detail = response.json()
            except Exception:
                detail = response.text
            raise RuntimeError(f"Groq API {response.status_code}: {detail}")
        return response.json()["choices"][0]["message"]["content"]

# ── Prompt Builder (for Groq LLM) ─────────────────────────────────────────────
def build_prompt(question: str, category: str, severity: str) -> str:
    """
    Builds a structured prompt for the LLM to ensure clear, actionable, and consistent legal advice.
    """
    return f"""
You are a professional Indian legal assistant.

Analyze the user's issue and respond in a clear, structured, and professional format.

STRICT INSTRUCTIONS:
- Use simple English suitable for a common Indian citizen
- Do NOT use emojis
- Do NOT write long paragraphs
- Use clear section headings (ALL CAPS)
- Use round bullet points (●)
- Keep responses concise and actionable
- Always follow the exact format below

User Problem:
"{question}"

Predicted Category: {category}
Predicted Severity: {severity}

FORMAT:

CASE UNDERSTANDING
This appears to be related to:
● {category}

RELEVANT INDIAN LAWS
● [Law Name with Year]
● [Law Name with Year]
● [Law Name with Year]

IMPORTANT RULE YOU SHOULD KNOW
[Rule Name]
[Explain in 3-4 simple sentences for a non-lawyer Indian citizen]

WHAT IS ILLEGAL IN THIS SITUATION
● [One clear sentence]

WHAT YOU SHOULD DO
Step 1: [Short Title]  
[1–2 line explanation]
Step 2: [Short Title]  
[1–2 line explanation]
Step 3: [Short Title]  
[1–2 line explanation]
Step 4: [Short Title]  
[1–2 line explanation]

WHEN IS THIS SERIOUS
Your case becomes serious if:
● [Condition 1]
● [Condition 2]
● [Condition 3]

IF THE MATTER IS SERIOUS
● [Immediate action advice]

IMPORTANT:
- Never skip any section
- Never merge sections
- Always keep formatting consistent
- Avoid legal jargon unless necessary

If the solution involves sending a complaint, legal notice, or formal communication,
then at the END write exactly:

EMAIL_NEEDED: YES

Otherwise write:

EMAIL_NEEDED: NO

Do not forget this line.
""".strip()

# ── Decision Engine ─────────────────────────────────────────────
def decide_action(severity):
    severity = severity.lower().strip()
    if severity == "serious":
        return "lawyer"
    elif severity == "moderate":
        return "ai_resolution"
    else:
        return "guidance"


# ── Intent Detection ────────────────────────────────────────────
def detect_intent(text):
    text = text.lower()

    if any(w in text for w in ["refund", "billing", "wrong product", "charged", "payment", "money"]):
        return "email"

    elif any(w in text for w in ["delay", "late", "not responding", "slow", "waiting"]):
        return "communication"

    elif any(w in text for w in ["fraud", "threat", "assault", "harassment", "abuse", "violence"]):
        return "serious"

    return "general"


# ── Solution Generator (YOUR AI LOGIC) ──────────────────────────
def generate_solution(text, category, severity):
    severity = severity.lower()
    intent = detect_intent(text)

    response = f"CASE TYPE: {category}\n\n"

    if severity == "serious":
        response += "⚠️ This is a serious legal issue.\n"
        response += "You should consult a lawyer immediately.\n"
        response += "Legal action or police involvement may be required.\n"

    elif severity == "moderate":

        if intent == "email":
            response += "You should send a formal complaint email.\n"
            response += f"""
EMAIL TEMPLATE

Subject: Complaint regarding {category}

Dear Sir/Madam,
I am facing an issue regarding "{text}". Kindly resolve it at the earliest.

Thank you.
"""

        elif intent == "communication":
            response += "Try resolving this by directly contacting the concerned person.\n"

        else:
            response += "Collect documents and escalate to higher authority if needed.\n"

    else:  # minor

        if intent == "email":
            response += "You can send a simple complaint email.\n"

        elif intent == "communication":
            response += "This can be resolved through simple communication.\n"

        else:
            response += "This is a minor issue and can be resolved easily.\n"

    return response

# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def home():
    """
    Health check endpoint. Returns a simple message if the service is running.
    """
    return {"message": "LawBridge AI Service Running"}



@app.get("/warmup", tags=["Health"])
def warmup():
    """
    Readiness check endpoint. Returns status if the AI service is ready.
    """
    return {"status": "AI is ready"}


@app.post("/predict", tags=["Prediction"], summary="Predict legal category, severity, and get legal advice", response_description="Prediction results including category, severity, action, solution, legal info, and lawyer recommendations.")
async def predict(data: InputText):
    """
    Main prediction endpoint.
    - Predicts category & severity
    - Generates AI legal guidance
    - Suggests lawyers if needed
    - Detects if email generation is required
    """
    try:
        logger.info(f"/predict request: {data.text[:100]}{'...' if len(data.text) > 100 else ''}")

        # --- Input validation ---
        if not data.text or len(data.text.strip()) < 10:
            logger.warning("Input text too short")
            return {"error": "Input text is too short. Please provide at least 10 characters."}

        if len(data.text) > 2000:
            logger.warning("Input text too long")
            return {"error": "Input text is too long. Maximum allowed is 2000 characters."}

        # --- Step 1: ML prediction ---
        category, severity, _, _ = predict_text(data.text)
        logger.info(f"Predicted category: {category}, severity: {severity}")

        # --- Step 2: Decision logic ---
        action = decide_action(severity)
        logger.info(f"Action decided: {action}")

        # --- Step 3: Base solution (your logic) ---
        if severity.strip().lower() == "minor":
            solution = get_minor_solution(data.text)
        else:
            solution = generate_solution(data.text, category, severity)

        # --- Step 4: Groq (only for moderate/serious) ---
    
        prompt = build_prompt(data.text, category, severity)
        
        email_needed=False
        legal_info=""

        if severity.strip().lower() in ["serious", "moderate"]:
            full_response = await call_groq(prompt)
            logger.info("Groq legal info generated.")

            # --- EMAIL DETECTION ---
            email_needed = "EMAIL_NEEDED: YES" in full_response

            # --- Clean response ---
            legal_info = (
                full_response
                .replace("EMAIL_NEEDED: YES", "")
                .replace("EMAIL_NEEDED: NO", "")
                .strip()
            )

        else:
            # --- Minor → no Groq ---
            # --- Ask Groq ONLY for email detection (light prompt) ---
            email_prompt = f"""
            User problem: {data.text}

            Does this situation require sending a formal complaint or legal email?

            Answer ONLY:
            EMAIL_NEEDED: YES
            or
            EMAIL_NEEDED: NO
            """

            email_check = await call_groq(email_prompt)

            email_needed = "YES" in email_check.upper()

        # --- Step 5: Lawyer recommendation ---
        lawyer_recommendations = []
        if action == "lawyer":
            lawyer_recommendations = recommend_lawyers(category, severity)
            logger.info(f"Recommended lawyers: {len(lawyer_recommendations)}")

        logger.info("/predict completed successfully.")

        # --- FINAL RESPONSE ---
        return {
            "category": category,
            "severity": severity,
            "action": action,
            "solution": solution,
            "legal_info": legal_info,
            "lawyers": lawyer_recommendations,
            "email_needed": email_needed   # 🔥 NEW FEATURE
        }

    except ValidationError as ve:
        logger.error(f"Validation error: {ve}")
        return {"error": ve.errors()}

    except RuntimeError as e:
        logger.error(f"Runtime error: {e}")
        return {"error": str(e)}

    except Exception as e:
        logger.error(f"Unhandled error: {e}")
        return {"error": str(e)}
# minor
# ── Minor Case Solution (Hardcoded CSV Logic - NO Groq) ─────────────────────
def get_minor_solution(text: str) -> str:
    text = text.lower().strip()
    
    for case in minor_cases:
        keyword_field = case.get("keyword", "").lower().strip()
        
        # ✅ Split multiple keywords
        keywords = [k.strip() for k in keyword_field.split("|") if k.strip()]
        
        # ✅ Check if ANY keyword matches
        if any(kw in text for kw in keywords):

            
            laws = case.get("relevant_laws", "")
            laws_list = [law.strip() for law in laws.split("|") if law.strip()]
            
            return f"""CASE UNDERSTANDING
This appears to be related to:
● {case.get("case_understanding", "a minor legal issue")}

RELEVANT INDIAN LAWS
{chr(10).join("● " + law for law in laws_list) if laws_list else "● Consumer Protection Act 2019"}

IMPORTANT RULE YOU SHOULD KNOW
{case.get("important_rule", "Always keep proof of purchase and communication.")}

WHAT IS ILLEGAL IN THIS SITUATION
● {case.get("what_is_illegal", "Not following through on your rights as a consumer.")}

WHAT YOU SHOULD DO
Step 1: {case.get("step1_title", "Contact the seller")}
{case.get("step1_desc", "")}

Step 2: {case.get("step2_title", "Escalate to platform")}
{case.get("step2_desc", "")}

Step 3: {case.get("step3_title", "File a complaint")}
{case.get("step3_desc", "")}

Step 4: {case.get("step4_title", "Approach consumer court")}
{case.get("step4_desc", "")}

WHEN IS THIS SERIOUS
Your case becomes serious if:
● {case.get("when_serious", "Amount is very high")}

IF THE MATTER IS SERIOUS
● {case.get("if_serious", "Contact a lawyer immediately")}
"""
    
    # ✅ Better fallback (slightly improved)
    return """
    CASE UNDERSTANDING
This appears to be related to:
● a minor consumer / general issue
IMPORTANT RULE YOU SHOULD KNOW
Keep all proofs (screenshots, order ID, messages).


"""
@app.post("/generate-email")
async def generate_email_api(data: InputText):
    try:
        prompt = f"""
You are a professional Indian legal assistant.

Write a formal legal email based on this issue:

"{data.text}"

Requirements:
- Clear subject line
- Proper greeting
- Structured body
- Legal tone
- Polite but firm language
- Closing with name placeholder

Return only the email.
"""

        email = await call_groq(prompt)

        return {
            "email": email
        }

    except Exception as e:
        return {"error": str(e)}
