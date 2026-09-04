from fastapi import APIRouter

from app.schemas.investigation import (
    InvestigationRequest,
    InvestigationResponse
)

from app.investigation.investigator import investigate_payment


router = APIRouter()


@router.post(
    "/investigate",
    response_model=InvestigationResponse
)
def investigate(request: InvestigationRequest):

    result = investigate_payment(request)

    return result