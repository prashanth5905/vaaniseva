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


def get_chatbot_reply(message: str) -> ChatbotResponse:
    normalized_message = message.lower()

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
            reply="You can view your applications here.",
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
            reply=f"You can apply for {service}.",
            action="apply",
            service=service,
        )

    if "certificate" in normalized_message:
        return ChatbotResponse(
            reply="Which certificate do you need?",
            action="select_certificate",
        )

    if any(
        keyword in normalized_message
        for keyword in ("document", "documents", "uploaded file", "files")
    ):
        return ChatbotResponse(
            reply="You can view your documents here.",
            action="documents",
        )

    if any(
        keyword in normalized_message
        for keyword in ("help", "what can you do")
    ):
        return ChatbotResponse(
            reply=(
                "I can help you check applications, apply for certificates, "
                "and view uploaded documents."
            ),
            action="help",
        )

    return ChatbotResponse(
        reply=(
            "I am here to help you with certificates and applications. "
            "Please ask me about applications, certificates, or documents."
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
