from app.schemas.chat import ChatRequest, ChatResponse


def process_message(request: ChatRequest) -> ChatResponse:
    return ChatResponse(
        message=request.message,
        response="VaaniSeva received your message."
    )