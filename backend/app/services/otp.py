from datetime import datetime, timedelta, timezone
from app.core.auth import create_access_token
from sqlalchemy.orm import Session

from app.core.security import generate_otp, hash_otp, verify_otp_hash
from app.repositories.citizen import get_citizen_by_aadhaar
from app.repositories.otp import (
    create_otp_verification,
    get_otp_verification,
    save_otp_verification,
)

# Development helper: keep the latest generated OTP in memory so the frontend
# can display it on the `/phone` page. This is intentionally simple and
# non-persistent so it doesn't affect the verification flow or DB schema.
LATEST_DEV_OTP: dict | None = None

def get_latest_dev_otp() -> dict | None:
    return LATEST_DEV_OTP

def request_otp(
    db: Session,
    aadhaar_number: str,
):
    citizen = get_citizen_by_aadhaar(db, aadhaar_number)

    if citizen is None:
        return None

    otp = generate_otp()

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    verification = create_otp_verification(
        db=db,
        citizen_id=citizen.id,
        otp_hash=hash_otp(otp),
        expires_at=expires_at,
    )

    # Store the plaintext OTP in-memory for the dev viewer page. This
    # does NOT change the stored hash or verification logic — it only
    # exposes the generated value for development/demo purposes.
    global LATEST_DEV_OTP
    LATEST_DEV_OTP = {
        "verification_id": verification.id,
        "otp": otp,
        "expires_at": expires_at.isoformat(),
    }

    return verification, citizen

def verify_otp(
    db: Session,
    verification_id: int,
    otp: str,
) -> str:

    verification = get_otp_verification(db, verification_id)

    if verification is None:
        return "not_found"

    if verification.verified:
        return "already_verified"

    if datetime.now(timezone.utc) > verification.expires_at:
        return "expired"

    if verification.attempts >= 5:
        return "too_many_attempts"

    if not verify_otp_hash(otp, verification.otp_hash):
        verification.attempts += 1
        save_otp_verification(db, verification)

        return "invalid"

    verification.verified = True
    save_otp_verification(db, verification)

    token = create_access_token(
        verification.citizen_id
    )

    return token