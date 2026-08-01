from app.models.application import Application
from app.repositories.application import (
    create_application,
    get_application_by_id,
    get_citizen_applications,
)
from app.repositories.application import (
    create_application,
    get_application_by_id,
    get_citizen_applications,
    get_all_applications,
    update_application,
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

def list_all_applications(db):
    return get_all_applications(db)

def approve_application(
    db,
    application_id: int,
):
    application = get_application_by_id(
        db,
        application_id,
    )

    if application is None:
        return None
    
    if application.status != "pending":
        return False

    application.status = "approved"

    return update_application(
        db,
        application,
    )

def reject_application(
    db,
    application_id: int,
):
    application = get_application_by_id(
        db,
        application_id,
    )

    if application is None:
        return None

    if application.status != "pending":
        return False

    application.status = "rejected"

    return update_application(
        db,
        application,
    )
