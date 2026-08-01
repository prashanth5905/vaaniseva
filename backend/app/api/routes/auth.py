from fastapi import APIRouter, Depends

from app.api.dependencies.auth import get_current_citizen
from app.models.citizen import Citizen

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.get("/me")
def me(
    citizen: Citizen = Depends(get_current_citizen),
):
    return {
        "id": citizen.id,
        "name": citizen.name,
        "district": citizen.district,
    }