from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_citizen
from app.db.dependencies import get_db
from app.models.citizen import Citizen
from app.schemas.chat import (
    ChatApplyResponse,
    ChatRequest,
    ChatResponse,
)
from app.services.chat import (
    apply_using_ai,
    process_message,
)


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post("/message", response_model=ChatResponse)
def send_message(request: ChatRequest) -> ChatResponse:
    return process_message(request)

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