from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.citizen import Citizen


def get_citizen_by_aadhaar(
    db: Session,
    aadhaar_number: str,
) -> Citizen | None:
    statement = select(Citizen).where(
        Citizen.aadhaar_number == aadhaar_number
    )

    return db.scalar(statement)

from sqlalchemy import select


def get_citizen_by_id(
    db: Session,
    citizen_id: int,
) -> Citizen | None:
    return db.scalar(
        select(Citizen).where(
            Citizen.id == citizen_id
        )
    )