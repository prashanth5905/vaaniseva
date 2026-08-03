import os
import shutil
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.citizen import Citizen
from app.models.document import Document
from app.repositories.document import (
    create_document,
    get_documents_by_citizen,
)


UPLOAD_FOLDER = "uploads/documents"


def upload_document(
    db: Session,
    citizen: Citizen,
    document_type: str,
    file: UploadFile,
):
    # Create uploads directory if it doesn't exist
    os.makedirs(
        UPLOAD_FOLDER,
        exist_ok=True,
    )

    # Generate unique filename
    unique_filename = f"{uuid4()}_{file.filename}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_filename,
    )

    # Save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    # Create database object
    document = Document(
        citizen_id=citizen.id,
        document_type=document_type,
        file_name=file.filename,
        file_path=file_path,
    )

    return create_document(
        db,
        document,
    )


def list_documents(
    db: Session,
    citizen: Citizen,
):
    return get_documents_by_citizen(
        db,
        citizen.id,
    )