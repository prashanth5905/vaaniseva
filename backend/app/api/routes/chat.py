from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_citizen
from app.db.dependencies import get_db
from app.models.citizen import Citizen
from app.services.chat_memory import chat_with_memory
from app.schemas.chat import (
    ChatApplyResponse,
    ChatRequest,
    ChatResponse,
)
from app.services.chat import apply_using_ai

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "/apply",
    response_model=ChatApplyResponse,
)
def apply_for_service(
    request: ChatRequest,
    citizen: Citizen = Depends(get_current_citizen),
    db: Session = Depends(get_db),
):
    return apply_using_ai(
        message=request.message,
        citizen=citizen,
        db=db,
    )

@router.post(
    "/message",
    response_model=ChatResponse,
)
def send_message(
    request: ChatRequest,
    citizen: Citizen = Depends(get_current_citizen),
    db: Session = Depends(get_db),
):
    answer = chat_with_memory(
        db=db,
        citizen_id=citizen.id,
        message=request.message,
    )

    return ChatResponse(
        message=request.message,
        response=answer,
    )