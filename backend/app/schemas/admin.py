from datetime import datetime

from pydantic import BaseModel


class CitizenInfo(BaseModel):
    id: int
    name: str
    aadhaar_number: str
    registered_phone: str
    district: str


class DocumentInfo(BaseModel):
    id: int
    document_type: str
    file_name: str
    file_path: str


class ApplicationInfo(BaseModel):
    id: int
    service_name: str
    status: str
    created_at: datetime


class ApplicationDetailsResponse(BaseModel):
    application: ApplicationInfo
    citizen: CitizenInfo
    documents: list[DocumentInfo]