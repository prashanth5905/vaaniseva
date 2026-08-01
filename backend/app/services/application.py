from app.models.application import Application
from app.repositories.application import (
    create_application,
    get_application_by_id,
    get_citizen_applications,
)

def submit_application(
    db,
    citizen_id: int,
    service_name: str,
):
    application = Application(
        citizen_id=citizen_id,
        service_name=service_name,
    )

    return create_application(
        db,
        application,
    )

def list_my_applications(
    db,
    citizen_id: int,
):
    return get_citizen_applications(
        db,
        citizen_id,
    )

def get_my_application(
    db,
    citizen_id: int,
    application_id: int,
):
    application = get_application_by_id(
        db,
        application_id,
    )

    if application is None:
        return None

    if application.citizen_id != citizen_id:
        return None

    return application
