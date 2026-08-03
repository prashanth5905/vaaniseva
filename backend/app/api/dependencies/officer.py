from fastapi import Depends, HTTPException

from app.api.dependencies.auth import get_current_citizen
from app.models.citizen import Citizen


def get_current_officer(
    citizen: Citizen = Depends(get_current_citizen),
) -> Citizen:
    if not citizen.is_officer:
        raise HTTPException(
            status_code=403,
            detail="Officer access required.",
        )

    return citizen