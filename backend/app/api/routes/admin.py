from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.application import ApplicationResponse
from app.services.application import (
    list_all_applications,
    approve_application,
    reject_application,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)

@router.get(
    "/applications",
    response_model=list[ApplicationResponse],
)
def get_all(
    db: Session = Depends(get_db),
):
    applications = list_all_applications(db)

    return [
        ApplicationResponse(
            id=app.id,
            service_name=app.service_name,
            status=app.status,
            created_at=app.created_at,
        )
        for app in applications
    ]

@router.patch(
    "/applications/{application_id}/approve",
    response_model=ApplicationResponse,
)
def approve(
    application_id: int,
    db: Session = Depends(get_db),
):
    application = approve_application(
        db,
        application_id,
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )
    if application is False:
        raise HTTPException(
            status_code=409,
            detail="Application has already been processed",
        )

    return ApplicationResponse(
        id=application.id,
        service_name=application.service_name,
        status=application.status,
        created_at=application.created_at,
    )

@router.patch(
    "/applications/{application_id}/reject",
    response_model=ApplicationResponse,
)
def reject(
    application_id: int,
    db: Session = Depends(get_db),
):
    application = reject_application(
        db,
        application_id,
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )
    
    if application is False:
        raise HTTPException(
            status_code=409,
            detail="Application has already been processed",
        )

    return ApplicationResponse(
        id=application.id,
        service_name=application.service_name,
        status=application.status,
        created_at=application.created_at,
    )