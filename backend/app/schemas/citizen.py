from pydantic import BaseModel, Field


class CitizenLookupRequest(BaseModel):
    aadhaar_number: str = Field(
        pattern=r"^\d{12}$",
        description="12-digit synthetic Aadhaar number",
    )


class CitizenLookupResponse(BaseModel):
    found: bool
    # name: str | None = None
    phone_hint: str | None = None