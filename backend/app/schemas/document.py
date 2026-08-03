from datetime import datetime

from pydantic import BaseModel


class DocumentUploadResponse(BaseModel):
    id: int
    document_type: str
    file_name: str
    uploaded_at: datetime


class DocumentResponse(BaseModel):
    id: int
    document_type: str
    file_name: str
    file_path: str
    uploaded_at: datetime