from sqlalchemy.orm import Session

from app.repositories.application import get_pending_applications


def list_pending_applications(
    db: Session,
):
    return get_pending_applications(db)