from pydantic import BaseModel, Field


class OTPRequest(BaseModel):
    aadhaar_number: str = Field(
        pattern=r"^\d{12}$"
    )


class OTPRequestResponse(BaseModel):
    verification_id: int
    phone_hint: str
    expires_in_seconds: int


class OTPVerifyRequest(BaseModel):
    verification_id: int
    otp: str = Field(
        pattern=r"^\d{6}$"
    )


class OTPVerifyResponse(BaseModel):
    status: str