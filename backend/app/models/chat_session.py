from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.sql import func

from app.db.base import Base


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True)

    citizen_id = Column(
        Integer,
        ForeignKey("citizens.id"),
        nullable=False,
    )

    history = Column(
        Text,
        nullable=False,
        default="",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )