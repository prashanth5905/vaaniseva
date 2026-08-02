from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai import ask_ai


def process_message(request: ChatRequest) -> ChatResponse:
    ai_response = ask_ai(request.message)

    return ChatResponse(
        message=request.message,
        response=ai_response,
    )