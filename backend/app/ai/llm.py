import os

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_CONFIGURED = bool(GEMINI_API_KEY and GEMINI_API_KEY != "your_api_key_here")

if GEMINI_CONFIGURED:
    genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")


def polish_with_gemini(context: str):
    if not GEMINI_CONFIGURED:
        return context

    prompt = f"""
You are Prospect Assist AI, a professional banking relationship manager copilot.

Rewrite the following banking analysis into a clear, professional, decision-support response.
Keep it concise, structured, and useful for a relationship manager.

Context:
{context}
"""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception:
        return context
