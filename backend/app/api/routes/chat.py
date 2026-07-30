from fastapi import APIRouter

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat import process_message


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post("/message", response_model=ChatResponse)
def send_message(request: ChatRequest) -> ChatResponse:
    return process_message(request)