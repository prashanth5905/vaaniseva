from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    citizen_id: Mapped[int] = mapped_column(
        ForeignKey("citizens.id"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(100),
        default="New Chat",
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )