from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.otp import (
    OTPRequest,
    OTPRequestResponse,
    OTPVerifyRequest,
    OTPVerifyResponse,
)
from app.services.otp import request_otp, verify_otp


router = APIRouter(
    prefix="/api/v1/otp",
    tags=["OTP"],
)


@router.post("/request", response_model=OTPRequestResponse)
def request_citizen_otp(
    data: OTPRequest,
    db: Session = Depends(get_db),
):
    result = request_otp(db, data.aadhaar_number)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Citizen not found",
        )

    verification, citizen = result

    return OTPRequestResponse(
        verification_id=verification.id,
        phone_hint="******" + citizen.registered_phone[-4:],
        expires_in_seconds=300,
    )

@router.post("/verify", response_model=OTPVerifyResponse)
def verify_citizen_otp(
    data: OTPVerifyRequest,
    db: Session = Depends(get_db),
):
    status = verify_otp(
        db=db,
        verification_id=data.verification_id,
        otp=data.otp,
    )

    if status == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Verification request not found",
        )

    if status == "expired":
        raise HTTPException(
            status_code=400,
            detail="OTP has expired",
        )

    if status == "too_many_attempts":
        raise HTTPException(
            status_code=429,
            detail="Too many OTP attempts",
        )

    if status == "invalid":
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP",
        )

    if status == "already_verified":
        raise HTTPException(
            status_code=409,
            detail="OTP already verified",
        )

    return OTPVerifyResponse(status="verified")