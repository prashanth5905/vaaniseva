from google import genai

from app.core.config import settings

client = genai.Client(
    api_key=settings.GEMINI_API_KEY,
)


SYSTEM_PROMPT = """
You are VaaniSeva AI.

You are an AI assistant for a Government Service Portal.

Your job is to help citizens with:

- Government certificates
- Application process
- Required documents
- Eligibility
- General government service guidance

Be polite.

Give short and accurate answers.

If the question is unrelated to government services,
politely explain that you only answer VaaniSeva related questions.
"""


def ask_ai(message: str) -> str:
    try:
        response = client.models.generate_content(
            model="models/gemini-3.5-flash",
            contents=[
                f"""
            You are VaaniSeva AI, an intelligent Government Services Assistant.

            Your job is to help citizens with ONLY government-related services.

            Supported services are:

            - Income Certificate
            - Birth Certificate
            - Residence Certificate
            - Caste Certificate
            - Death Certificate

            Rules:

            1. If the citizen describes a problem, determine which certificate/service they need.

            2. Mention the exact service name.

            3. Explain why they need that service.

            4. Keep answers short and professional.

            5. If the question is NOT about government services,
            politely refuse.

            Citizen Question:

            {message}
            """
            ],
        )

        text = response.text

        # Remove Markdown bold markers
        text = text.replace("**", "")

        # Normalize line endings
        text = text.replace("\r\n", "\n")

        return text.strip()

    except Exception as e:
        return f"AI Error: {str(e)}"

def detect_service(message: str) -> str | None:
    response = ask_ai(message)

    # If AI refused to answer, don't detect any service
    refusal_phrases = [
        "only assist with government",
        "unable to answer",
        "non-government",
        "cannot answer",
        "sorry",
        "apologize",
    ]

    if any(phrase in response.lower() for phrase in refusal_phrases):
        return None

    services = [
        "Income Certificate",
        "Residence Certificate",
        "Birth Certificate",
        "Caste Certificate",
        "Death Certificate",
    ]

    for service in services:
        if service.lower() in response.lower():
            return service

    return None

def ask_ai_with_history(
    history: list[tuple[str, str]],
    message: str,
) -> str:
    conversation = ""

    for role, content in history:
        conversation += f"{role}: {content}\n"

    conversation += f"User: {message}"

    prompt = f"""
You are VaaniSeva AI.

You assist citizens with government services only.

Continue the conversation naturally.

Conversation History:

{conversation}

Answer the user's latest question.
"""

    try:
        response = client.models.generate_content(
            model="models/gemini-3.5-flash",
            contents=prompt,
        )

        return response.text.strip()

    except Exception:
        return (
            "I'm sorry, the VaaniSeva AI service is temporarily unavailable. "
            "Please try again in a few minutes."
        )

from app.models.citizen import Citizen
from sqlalchemy.orm import Session

from app.services.context import build_citizen_context


def ask_ai_with_context(
    db: Session,
    citizen: Citizen,
    question: str,
) -> str:

    context = build_citizen_context(
        db,
        citizen,
    )

    prompt = f"""
You are VaaniSeva AI.

You are an AI assistant for a Government Service Portal.

Below is the citizen's information.

{context}

Citizen Question:

{question}

Instructions:

- Use the citizen information whenever relevant.
- Answer naturally.
- If the question is unrelated to government services,
  politely refuse.
"""

    try:
        response = client.models.generate_content(
            model="models/gemini-3.5-flash",
            contents=prompt,
        )

        return response.text.strip()

    except Exception:
        return (
            "I'm sorry, the AI service is currently unavailable."
        )

def generate_chat_title(
    message: str,
) -> str:

    prompt = f"""
Generate a short title (maximum 5 words)
for this government service conversation.

Message:

{message}

Return ONLY the title.
"""

    try:
        response = client.models.generate_content(
            model="models/gemini-3.5-flash",
            contents=prompt,
        )

        return response.text.strip()

    except Exception:
        return "New Chat"