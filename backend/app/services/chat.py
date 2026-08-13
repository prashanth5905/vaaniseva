import re

from app.schemas.chat import ChatRequest, ChatResponse, ChatbotResponse
from app.services.ai import ask_ai
from app.services.gemini_service import generate_gemini_response
from fastapi import HTTPException

from app.models.citizen import Citizen
from app.schemas.chat import ChatApplyResponse
from app.services.ai import detect_service
from app.services.application import submit_application
from app.schemas.application import ApplicationCreateRequest
from app.models.application import Application
from sqlalchemy.orm import Session


CERTIFICATE_INFORMATION = {
    "Income Certificate": {
        "required_documents": [
            "Aadhaar Card",
            "Income Proof",
            "Address Proof",
        ],
        "processing_time": "7 working days",
        "fee": "₹30",
    },
    "Residence Certificate": {
        "required_documents": [
            "Not available in the project",
        ],
        "processing_time": "Not available in the project",
        "fee": "Not available in the project",
    },
    "Birth Certificate": {
        "required_documents": [
            "Not available in the project",
        ],
        "processing_time": "Not available in the project",
        "fee": "Not available in the project",
    },
    "Community Certificate": {
        "required_documents": [
            "Not available in the project",
        ],
        "processing_time": "Not available in the project",
        "fee": "Not available in the project",
    },
}

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


def is_document_action_request(normalized_message: str) -> bool:
    if not any(
        keyword in normalized_message
        for keyword in (
            "document",
            "documents",
            "uploaded file",
            "files",
        )
    ):
        return False

    if any(
        phrase in normalized_message
        for phrase in (
            "show my documents",
            "view my documents",
            "open my documents",
            "show my uploaded documents",
            "view my uploaded documents",
            "open my uploaded documents",
            "where can i find my documents",
            "where can i find my uploaded documents",
        )
    ):
        return True

    action_words = {"show", "view", "open", "find", "access", "check", "see", "display"}
    words = set(normalized_message.split())
    if words.intersection(action_words):
        return True

    return "where can i find" in normalized_message


def serialize_application(application: Application) -> dict[str, str]:
    return {
        "service_name": application.service_name,
        "status": application.status,
        "submitted_date": application.created_at.isoformat(),
    }


def get_application_reply(
    normalized_message: str,
    citizen: Citizen,
    db: Session,
) -> dict[str, object]:
    applications = (
        db.query(Application)
        .filter(Application.citizen_id == citizen.id)
        .order_by(Application.created_at.desc())
        .all()
    )

    requested_status = next(
        (
            status
            for status in ("pending", "approved", "rejected")
            if status in normalized_message
        ),
        None,
    )

    if requested_status:
        applications = [
            application
            for application in applications
            if application.status.lower() == requested_status
        ]

    if "latest application" in normalized_message:
        applications = applications[:1]

    serialized_applications = [
        serialize_application(application)
        for application in applications
    ]

    if not serialized_applications:
        if requested_status:
            reply = f"You do not have any {requested_status} applications."
        else:
            reply = "You do not have any applications yet."
    elif "latest application" in normalized_message:
        reply = "Here is your latest application."
    elif requested_status:
        reply = f"Here are your {requested_status} applications."
    else:
        reply = "Here are your applications."

    return {
        "reply": reply,
        "action": "applications",
        "applications": serialized_applications,
    }


def get_chatbot_reply(
    message: str,
    citizen: Citizen | None = None,
    db: Session | None = None,
) -> ChatbotResponse | dict[str, object]:
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
        if citizen is not None and db is not None:
            return get_application_reply(
                normalized_message,
                citizen,
                db,
            )

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
            for certificate in CERTIFICATE_INFORMATION
            if certificate.lower() in normalized_message
        ),
        None,
    )

    if service:
        certificate_information = CERTIFICATE_INFORMATION[service]
        article = "an" if service == "Income Certificate" else "a"

        return {
            "reply": f"You can apply for {article} {service}.",
            "required_documents": certificate_information["required_documents"],
            "processing_time": certificate_information["processing_time"],
            "fee": certificate_information["fee"],
            "action": "apply",
            "service": service,
        }

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

    if is_document_action_request(normalized_message):
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

    fallback_reply = choose_reply(
        normalized_message,
        (
            "I am here to help you with certificates and applications. "
            "Please ask me about applications, certificates, or documents.",
            "I can help with government certificates, application status, and documents.",
        ),
    )

    gemini_reply = generate_gemini_response(message)

    if gemini_reply:
        return ChatbotResponse(
            reply=gemini_reply,
            action="help",
        )

    return ChatbotResponse(
        reply=fallback_reply,
        action="help",
    )

def process_message(request: ChatRequest) -> ChatResponse:
    ai_response = ask_ai(request.message)

    return ChatResponse(
        message=request.message,
        response=ai_response,
    )

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
