from datetime import datetime

from pydantic import BaseModel


class ApplicationCreateRequest(BaseModel):
    service_name: str


class ApplicationResponse(BaseModel):
    id: int
    service_name: str
    status: str
    created_at: datetime