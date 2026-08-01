from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.auth import decode_access_token
from app.db.dependencies import get_db
from app.repositories.citizen import get_citizen_by_id

security = HTTPBearer()


def get_current_citizen(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(
        credentials.credentials
    )

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid access token",
        )

    citizen = get_citizen_by_id(
        db,
        int(payload["sub"]),
    )

    if citizen is None:
        raise HTTPException(
            status_code=401,
            detail="Citizen not found",
        )

    return citizen