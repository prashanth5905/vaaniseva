from pydantic import BaseModel, Field, field_validator


class ChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=2000,
        description="User's text message to VaaniSeva",
    )

    @field_validator("message")
    @classmethod
    def validate_message(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Message cannot be empty")

        return value


class ChatResponse(BaseModel):
    message: str
    response: str


class ChatbotResponse(BaseModel):
    reply: str
    action: str | None = None
    service: str | None = None


class ChatApplyResponse(BaseModel):
    service_name: str
    application_id: int
    status: str
    message: str
