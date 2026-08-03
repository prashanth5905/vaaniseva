from datetime import datetime

from pydantic import BaseModel


class ChatSessionResponse(BaseModel):
    id: int
    title: str
    created_at: datetime


class ChatMessageResponse(BaseModel):
    role: str
    message: str
    created_at: datetime