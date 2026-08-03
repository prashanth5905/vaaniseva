from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.officer import get_current_officer
from app.db.dependencies import get_db
from app.models.citizen import Citizen
from app.schemas.officer import OfficerApplicationResponse
from app.services.officer import list_pending_applications
from app.schemas.application import ApplicationResponse
from app.services.application import (
    list_all_applications,
    approve_application,
    reject_application,
)
from app.schemas.admin import ApplicationDetailsResponse
from app.services.admin import get_application_details
from app.services.admin import approve, reject
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard import get_dashboard

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

# @router.patch(
#     "/applications/{application_id}/approve",
#     response_model=ApplicationResponse,
# )
# def approve(
#     application_id: int,
#     db: Session = Depends(get_db),
# ):
#     application = approve_application(
#         db,
#         application_id,
#     )

#     if application is None:
#         raise HTTPException(
#             status_code=404,
#             detail="Application not found",
#         )
#     if application is False:
#         raise HTTPException(
#             status_code=409,
#             detail="Application has already been processed",
#         )

#     return ApplicationResponse(
#         id=application.id,
#         service_name=application.service_name,
#         status=application.status,
#         created_at=application.created_at,
#     )

# @router.patch(
#     "/applications/{application_id}/reject",
#     response_model=ApplicationResponse,
# )
# def reject(
#     application_id: int,
#     db: Session = Depends(get_db),
# ):
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

@router.get(
    "/applications/pending",
    response_model=list[OfficerApplicationResponse],
)
def pending_applications(
    officer: Citizen = Depends(get_current_officer),
    db: Session = Depends(get_db),
):
    return list_pending_applications(db)

@router.get(
    "/applications/{application_id}",
    response_model=ApplicationDetailsResponse,
)
def application_details(
    application_id: int,
    db: Session = Depends(get_db),
    officer=Depends(get_current_officer),
):
    return get_application_details(
        db=db,
        application_id=application_id,
    )

@router.post("/applications/{application_id}/approve")
def approve_route(
    application_id: int,
    db: Session = Depends(get_db),
    officer=Depends(get_current_officer),
):
    application = approve(
        db=db,
        application_id=application_id,
    )

    return {
        "message": "Application approved.",
        "status": application.status,
    }


@router.post("/applications/{application_id}/reject")
def reject_route(
    application_id: int,
    db: Session = Depends(get_db),
    officer=Depends(get_current_officer),
):
    application = reject(
        db=db,
        application_id=application_id,
    )

    return {
        "message": "Application rejected.",
        "status": application.status,
    }

@router.get(
    "/dashboard",
    response_model=DashboardResponse,
)
def dashboard(
    db: Session = Depends(get_db),
    officer=Depends(get_current_officer),
):
    return get_dashboard(db)