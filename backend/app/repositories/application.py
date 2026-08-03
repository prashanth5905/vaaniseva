from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.application import Application

def create_application(
    db: Session,
    application: Application,
) -> Application:
    db.add(application)
    db.commit()
    db.refresh(application)

    return application

def get_citizen_applications(
    db: Session,
    citizen_id: int,
):
    return list(
        db.scalars(
            select(Application).where(
                Application.citizen_id == citizen_id
            )
        )
    )

def get_application_by_id(
    db: Session,
    application_id: int,
):
    return db.scalar(
        select(Application).where(
            Application.id == application_id
        )
    )
def get_all_applications(
    db: Session,
):
    return list(
        db.scalars(
            select(Application)
        )
    )

def update_application(
    db: Session,
    application: Application,
):
    db.commit()
    db.refresh(application)

    return application

def get_pending_applications(
    db: Session,
):
    return (
        db.query(Application)
        .filter(
            Application.status == "pending"
        )
        .order_by(
            Application.created_at.desc()
        )
        .all()
    )

from app.models.application import Application


def get_application_by_id(
    db,
    application_id: int,
):
    return (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

def approve_application(
    db,
    application,
):
    application.status = "approved"

    db.commit()
    db.refresh(application)

    return application


def reject_application(
    db,
    application,
):
    application.status = "rejected"

    db.commit()
    db.refresh(application)

    return application