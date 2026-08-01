from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_citizen
from app.db.dependencies import get_db
from app.models.citizen import Citizen
from app.schemas.application import (
    ApplicationCreateRequest,
    ApplicationResponse,
)
from app.services.application import submit_application
from app.services.application import (
    submit_application,
    list_my_applications,
    get_my_application,
)

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)

@router.post(
    "",
    response_model=ApplicationResponse,
)
def create_application(
    data: ApplicationCreateRequest,
    citizen: Citizen = Depends(get_current_citizen),
    db: Session = Depends(get_db),
):
    application = submit_application(
        db=db,
        citizen_id=citizen.id,
        service_name=data.service_name,
    )

    return ApplicationResponse(
        id=application.id,
        service_name=application.service_name,
        status=application.status,
        created_at=application.created_at,
    )

@router.get(
    "",
    response_model=list[ApplicationResponse],
)
def list_applications(
    citizen: Citizen = Depends(get_current_citizen),
    db: Session = Depends(get_db),
):
    applications = list_my_applications(
        db=db,
        citizen_id=citizen.id,
    )

    return [
        ApplicationResponse(
            id=app.id,
            service_name=app.service_name,
            status=app.status,
            created_at=app.created_at,
        )
        for app in applications
    ]

@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def get_application(
    application_id: int,
    citizen: Citizen = Depends(get_current_citizen),
    db: Session = Depends(get_db),
):
    application = get_my_application(
        db=db,
        citizen_id=citizen.id,
        application_id=application_id,
    )

    if application is None:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return ApplicationResponse(
        id=application.id,
        service_name=application.service_name,
        status=application.status,
        created_at=application.created_at,
    )