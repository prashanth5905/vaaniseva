from sqlalchemy.orm import Session

from app.models.citizen import Citizen
from app.repositories.chat import (
    get_chat_sessions,
    get_messages,
)


def list_sessions(
    db: Session,
    citizen: Citizen,
):
    return get_chat_sessions(
        db,
        citizen.id,
    )


def session_messages(
    db: Session,
    session_id: int,
):
    return get_messages(
        db,
        session_id,
    )