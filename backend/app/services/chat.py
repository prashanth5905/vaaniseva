import re

from app.schemas.chat import ChatRequest, ChatResponse, ChatbotResponse
from app.services.ai import ask_ai
from fastapi import HTTPException

from app.models.citizen import Citizen
from app.schemas.chat import ChatApplyResponse
from app.services.ai import detect_service
from app.services.application import submit_application
from app.schemas.application import ApplicationCreateRequest


CERTIFICATE_SERVICES = (
    "Income Certificate",
    "Residence Certificate",
    "Birth Certificate",
    "Community Certificate",
)

COMMON_MISSPELLINGS = {
    "applicaton": "applications",
    "aplication": "applications",
    "applicatons": "applications",
    "documnts": "documents",
    "documnets": "documents",
    "documentz": "documents",
    "certficate": "certificate",
    "certifcate": "certificate",
    "aplly": "apply",
    "aply": "apply",
    "statuz": "status",
}


def normalize_chat_message(message: str) -> str:
    words = re.findall(r"[a-z]+", message.lower())

    return " ".join(
        COMMON_MISSPELLINGS.get(word, word)
        for word in words
    )


def choose_reply(message: str, replies: tuple[str, ...]) -> str:
    return replies[sum(ord(character) for character in message) % len(replies)]


def get_chatbot_reply(message: str) -> ChatbotResponse:
    normalized_message = normalize_chat_message(message)
    words = set(normalized_message.split())

    if (
        "good morning" in normalized_message
        or "good afternoon" in normalized_message
        or "good evening" in normalized_message
        or words.intersection({"hi", "hello", "hey", "namaste"})
    ):
        greeting_replies = (
            "Hello! 👋 How can I help you today?",
            "Namaste! How can I assist you with government services today?",
            "Welcome to VaaniSeva! What would you like help with today?",
        )
        return ChatbotResponse(
            reply=choose_reply(normalized_message, greeting_replies),
            action="help",
        )

    if (
        "thank you" in normalized_message
        or words.intersection({"thanks", "thankyou"})
    ):
        return ChatbotResponse(
            reply="You're welcome! 😊 Let me know if you need any other help.",
            action="help",
        )

    if (
        "see you" in normalized_message
        or words.intersection({"bye", "goodbye"})
    ):
        return ChatbotResponse(
            reply="Thank you for using VaaniSeva. Have a great day!",
            action="help",
        )

    if any(
        keyword in normalized_message
        for keyword in (
            "application",
            "applications",
            "status",
            "certificate status",
            "my certificate",
        )
    ):
        return ChatbotResponse(
            reply=choose_reply(
                normalized_message,
                (
                    "You can view your applications here.",
                    "Your application details and status are available here.",
                ),
            ),
            action="applications",
        )

    service = next(
        (
            certificate
            for certificate in CERTIFICATE_SERVICES
            if certificate.lower() in normalized_message
        ),
        None,
    )

    if service:
        return ChatbotResponse(
            reply=choose_reply(
                normalized_message,
                (
                    f"You can apply for {service}.",
                    f"I can help you start an application for {service}.",
                ),
            ),
            action="apply",
            service=service,
        )

    if "certificate" in normalized_message:
        return ChatbotResponse(
            reply="Which certificate do you need?",
            action="select_certificate",
        )

    if "apply" in words:
        return ChatbotResponse(
            reply=choose_reply(
                normalized_message,
                (
                    "You can apply for a certificate here.",
                    "Let us start your certificate application.",
                ),
            ),
            action="apply",
        )

    if any(
        keyword in normalized_message
        for keyword in ("document", "documents", "uploaded file", "files")
    ):
        return ChatbotResponse(
            reply=choose_reply(
                normalized_message,
                (
                    "You can view your documents here.",
                    "Your uploaded documents are available here.",
                ),
            ),
            action="documents",
        )

    if any(
        keyword in normalized_message
        for keyword in ("help", "what can you do")
    ):
        return ChatbotResponse(
            reply=choose_reply(
                normalized_message,
                (
                    "I can help you check applications, apply for certificates, "
                    "and view uploaded documents.",
                    "I can guide you through certificates, applications, and documents.",
                ),
            ),
            action="help",
        )

    return ChatbotResponse(
        reply=choose_reply(
            normalized_message,
            (
                "I am here to help you with certificates and applications. "
                "Please ask me about applications, certificates, or documents.",
                "I can help with government certificates, application status, and documents.",
            ),
        ),
        action="help",
    )

def process_message(request: ChatRequest) -> ChatResponse:
    ai_response = ask_ai(request.message)

    return ChatResponse(
        message=request.message,
        response=ai_response,
    )

from sqlalchemy.orm import Session

def apply_using_ai(
    message: str,
    citizen: Citizen,
    db: Session,
) -> ChatApplyResponse:

    service = detect_service(message)

    if service is None:
        raise HTTPException(
            status_code=400,
            detail="I could not determine which government service you need.",
        )

    application = submit_application(
        db=db,
        citizen_id=citizen.id,
        service_name=service,
    )

    return ChatApplyResponse(
        service_name=service,
        application_id=application.id,
        status=application.status,
        message="Application created successfully.",
    )
