from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    message: str
    response: str


@router.post("/message", response_model=ChatResponse)
def send_message(request: ChatRequest) -> ChatResponse:
    return ChatResponse(
        message=request.message,
        response="VaaniSeva received your message."
    )