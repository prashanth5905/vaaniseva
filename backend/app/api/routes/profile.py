from fastapi import APIRouter, Depends

from app.api.dependencies.auth import get_current_citizen
from app.models.citizen import Citizen
from app.schemas.profile import CitizenProfileResponse

router = APIRouter(
    prefix="/profile",
    tags=["Profile"],
)


@router.get(
    "",
    response_model=CitizenProfileResponse,
)
def get_profile(
    citizen: Citizen = Depends(get_current_citizen),
):
    return CitizenProfileResponse(
        id=citizen.id,
        aadhaar_number=citizen.aadhaar_number,
        name=citizen.name,
        registered_phone=citizen.registered_phone,
        date_of_birth=str(citizen.date_of_birth),
        district=citizen.district,
    )