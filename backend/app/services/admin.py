from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.application import get_application_by_id
from app.repositories.citizen import get_citizen_by_id
from app.repositories.document import get_documents_by_citizen_id

from app.schemas.admin import (
    ApplicationDetailsResponse,
    ApplicationInfo,
    CitizenInfo,
    DocumentInfo,
)
from app.repositories.application import (
    approve_application,
    reject_application,
)


def get_application_details(
    db: Session,
    application_id: int,
) -> ApplicationDetailsResponse:

    application = get_application_by_id(
        db,
        application_id,
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    citizen = get_citizen_by_id(
        db,
        application.citizen_id,
    )

    documents = get_documents_by_citizen_id(
        db,
        application.citizen_id,
    )

    return ApplicationDetailsResponse(
        application=ApplicationInfo(
            id=application.id,
            service_name=application.service_name,
            status=application.status,
            created_at=application.created_at,
        ),
        citizen=CitizenInfo(
            id=citizen.id,
            name=citizen.name,
            aadhaar_number=citizen.aadhaar_number,
            registered_phone=citizen.registered_phone,
            district=citizen.district,
        ),
        documents=[
            DocumentInfo(
                id=doc.id,
                document_type=doc.document_type,
                file_name=doc.file_name,
                file_path=doc.file_path,
            )
            for doc in documents
        ],
    )

def approve(
    db: Session,
    application_id: int,
):
    application = get_application_by_id(
        db,
        application_id,
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    return approve_application(
        db,
        application,
    )


def reject(
    db: Session,
    application_id: int,
):
    application = get_application_by_id(
        db,
        application_id,
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    return reject_application(
        db,
        application,
    )