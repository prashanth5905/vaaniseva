from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_citizen
from app.db.dependencies import get_db
from app.models.citizen import Citizen
from app.services.smart_chat import smart_chat
from app.schemas.chat import (
    ChatApplyResponse,
    ChatRequest,
    ChatResponse,
)
from app.services.chat import apply_using_ai
from app.schemas.chat_session import (
    ChatSessionResponse,
    ChatMessageResponse,
)

from app.services.chat_history import (
    list_sessions,
    session_messages,
)

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
    answer = smart_chat(
        db=db,
        citizen=citizen,
        question=request.message,
    )

    return ChatResponse(
        message=request.message,
        response=answer,
    )

@router.get(
    "/sessions",
    response_model=list[ChatSessionResponse],
)
def get_sessions(
    citizen: Citizen = Depends(get_current_citizen),
    db: Session = Depends(get_db),
):
    return list_sessions(
        db,
        citizen,
    )

@router.get(
    "/sessions/{session_id}",
    response_model=list[ChatMessageResponse],
)
def get_session_messages(
    session_id: int,
    citizen: Citizen = Depends(get_current_citizen),
    db: Session = Depends(get_db),
):
    return session_messages(
        db,
        session_id,
    )