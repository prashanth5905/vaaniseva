from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_citizen
from app.db.dependencies import get_db
from app.models.citizen import Citizen
from app.schemas.document import (
    DocumentResponse,
    DocumentUploadResponse,
)
from app.services.document import (
    list_documents,
    upload_document,
)
from fastapi.responses import FileResponse
from fastapi import HTTPException

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.post(
    "/upload",
    response_model=DocumentUploadResponse,
)
def upload(
    document_type: str = Form(...),
    file: UploadFile = File(...),
    citizen: Citizen = Depends(get_current_citizen),
    db: Session = Depends(get_db),
):
    return upload_document(
        db=db,
        citizen=citizen,
        document_type=document_type,
        file=file,
    )


@router.get(
    "",
    response_model=list[DocumentResponse],
)
def get_documents(
    citizen: Citizen = Depends(get_current_citizen),
    db: Session = Depends(get_db),
):
    return list_documents(
        db=db,
        citizen=citizen,
    )

@router.get("/{document_id}/download")
def download_document(
    document_id:int,
    db:Session = Depends(get_db),
):

    document = get_document_by_id(
        db,
        document_id
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )


    return FileResponse(
        path=document.file_path,
        filename=document.file_name,
        media_type="application/pdf",
    )