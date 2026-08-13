import logging

from google import genai
from google.genai import types

from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are VaaniSeva AI, a helpful assistant for a government service portal.

Help citizens with general government-service questions in a polite, concise, and conversational way.

Rules:
- Focus on VaaniSeva-related government services.
- Do not pretend to know the user's personal application status, citizen records, or government records.
- Do not invent completed actions or claim that a service was already applied for.
- If the user needs a structured VaaniSeva action, explain that they should use the relevant service in the portal.
- Keep answers short, helpful, and clear.
"""

LANGUAGE_INSTRUCTION = (
    "Respond in the same language as the user. "
    "If the user writes in English, respond in English. "
    "If the user writes in Telugu, respond in Telugu. "
    "If the user writes in Hindi, respond in Hindi. "
    "If the user writes in Kannada, respond in Kannada. "
    "Do not translate the response into English unless the user asks for a translation."
)


def build_system_instruction() -> str:
    return f"{SYSTEM_PROMPT}\n\n{LANGUAGE_INSTRUCTION}"


def generate_gemini_response(message: str) -> str | None:
    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY is missing; skipping Gemini fallback")
        return None

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        response = client.models.generate_content(
            model="models/gemini-flash-latest",
            contents=message,
            config=types.GenerateContentConfig(system_instruction=build_system_instruction()),
        )
        return response.text.strip() if getattr(response, "text", None) else None
    except Exception as exc:
        logger.exception("Gemini fallback failed: %s", exc)
        return None

