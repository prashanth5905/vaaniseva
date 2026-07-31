from sqlalchemy.orm import Session

from app.repositories.citizen import get_citizen_by_aadhaar
from app.schemas.citizen import CitizenLookupResponse


def lookup_citizen(
    db: Session,
    aadhaar_number: str,
) -> CitizenLookupResponse:

    citizen = get_citizen_by_aadhaar(db, aadhaar_number)

    if citizen is None:
        return CitizenLookupResponse(
            found=False,
        )

    phone_hint = f"******{citizen.registered_phone[-4:]}"

    return CitizenLookupResponse(
        found=True,
        phone_hint=phone_hint,
    )