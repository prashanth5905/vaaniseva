from datetime import datetime

from pydantic import BaseModel


class OfficerApplicationResponse(BaseModel):
    id: int
    citizen_id: int
    service_name: str
    status: str
    created_at: datetime


class OfficerCitizenResponse(BaseModel):
    id: int
    name: str
    registered_phone: str