from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.otp_verification import OTPVerification


def create_otp_verification(
    db: Session,
    citizen_id: int,
    otp_hash: str,
    expires_at,
) -> OTPVerification:
    verification = OTPVerification(
        citizen_id=citizen_id,
        otp_hash=otp_hash,
        expires_at=expires_at,
        verified=False,
        attempts=0,
    )

    db.add(verification)
    db.commit()
    db.refresh(verification)

    return verification

def get_otp_verification(
    db: Session,
    verification_id: int,
) -> OTPVerification | None:
    return db.scalar(
        select(OTPVerification).where(
            OTPVerification.id == verification_id
        )
    )


def save_otp_verification(
    db: Session,
    verification: OTPVerification,
) -> OTPVerification:
    db.commit()
    db.refresh(verification)
    return verification