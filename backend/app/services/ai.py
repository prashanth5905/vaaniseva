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
                SYSTEM_PROMPT,
                message,
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