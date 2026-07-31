from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.citizen import CitizenLookupRequest, CitizenLookupResponse
from app.services.citizen import lookup_citizen


router = APIRouter(
    prefix="/citizens",
    tags=["Citizens"],
)


@router.post("/lookup", response_model=CitizenLookupResponse)
def citizen_lookup(
    request: CitizenLookupRequest,
    db: Session = Depends(get_db),
) -> CitizenLookupResponse:
    return lookup_citizen(
        db=db,
        aadhaar_number=request.aadhaar_number,
    )