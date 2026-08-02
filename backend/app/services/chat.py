from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai import ask_ai
from fastapi import HTTPException

from app.models.citizen import Citizen
from app.schemas.chat import ChatApplyResponse
from app.services.ai import detect_service
from app.services.application import submit_application
from app.schemas.application import ApplicationCreateRequest

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