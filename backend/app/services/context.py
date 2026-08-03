from sqlalchemy.orm import Session

from app.models.citizen import Citizen
from app.repositories.application import get_citizen_applications


def build_citizen_context(
    db: Session,
    citizen: Citizen,
) -> str:
    applications = get_citizen_applications(
        db,
        citizen.id,
    )

    context = f"""
Citizen Information

Name: {citizen.name}

Applications:
"""

    if not applications:
        context += "\nNo applications submitted yet.\n"
    else:
        for app in applications:
            context += (
                f"\n- {app.service_name}"
                f" ({app.status})"
            )

    return context