from pydantic import BaseModel


class CitizenProfileResponse(BaseModel):
    id: int
    aadhaar_number: str
    name: str
    registered_phone: str
    date_of_birth: str
    district: str