from datetime import datetime
from zoneinfo import ZoneInfo

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True)

    citizen_id: Mapped[int] = mapped_column(
        ForeignKey("citizens.id"),
        index=True,
    )

    service_name: Mapped[str] = mapped_column(
        String(100)
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(
            ZoneInfo("Asia/Kolkata")
        ),
    )