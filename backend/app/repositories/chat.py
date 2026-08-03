from sqlalchemy.orm import Session

from app.models.chat_message import ChatMessage
from app.models.chat_session import ChatSession


def create_chat_session(
    db: Session,
    citizen_id: int,
    title: str,
) -> ChatSession:
    session = ChatSession(
        citizen_id=citizen_id,
        title=title,
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


def get_chat_session(
    db: Session,
    citizen_id: int,
) -> ChatSession | None:
    return (
        db.query(ChatSession)
        .filter(ChatSession.citizen_id == citizen_id)
        .first()
    )


def save_message(
    db: Session,
    session_id: int,
    role: str,
    message: str,
) -> ChatMessage:

    chat_message = ChatMessage(
        session_id=session_id,
        role=role,
        message=message,
    )

    db.add(chat_message)
    db.commit()
    db.refresh(chat_message)

    return chat_message


def get_recent_messages(
    db: Session,
    session_id: int,
    limit: int = 10,
):
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(limit)
        .all()
    )

    return list(reversed(messages))

def get_chat_sessions(
    db: Session,
    citizen_id: int,
):
    return (
        db.query(ChatSession)
        .filter(
            ChatSession.citizen_id == citizen_id
        )
        .order_by(
            ChatSession.created_at.desc()
        )
        .all()
    )

def get_messages(
    db: Session,
    session_id: int,
):
    return (
        db.query(ChatMessage)
        .filter(
            ChatMessage.session_id == session_id
        )
        .order_by(
            ChatMessage.created_at.asc()
        )
        .all()
    )