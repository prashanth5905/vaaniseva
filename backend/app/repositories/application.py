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