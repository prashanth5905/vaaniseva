from sqlalchemy.orm import Session

from app.repositories.chat import (
    create_chat_session,
    get_chat_session,
    get_recent_messages,
    save_message,
)
from app.services.ai import ask_ai_with_history


def chat_with_memory(
    db: Session,
    citizen_id: int,
    message: str,
):
    print("=== chat_with_memory called ===")
    session = get_chat_session(
        db,
        citizen_id,
    )

    if session is None:
        title = generate_chat_title(message)
        session = create_chat_session(
            db,
            citizen_id,
            title,
        )

    messages = get_recent_messages(
        db,
        session.id,
    )

    history = [
        (m.role, m.message)
        for m in messages
    ]

    answer = ask_ai_with_history(
        history,
        message,
    )

    save_message(
        db,
        session.id,
        "User",
        message,
    )

    save_message(
        db,
        session.id,
        "Assistant",
        answer,
    )

    return answer