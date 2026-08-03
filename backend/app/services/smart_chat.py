from sqlalchemy.orm import Session

from app.models.citizen import Citizen
from app.services.ai import ask_ai_with_context


def smart_chat(
    db: Session,
    citizen: Citizen,
    question: str,
):
    return ask_ai_with_context(
        db=db,
        citizen=citizen,
        question=question,
    )