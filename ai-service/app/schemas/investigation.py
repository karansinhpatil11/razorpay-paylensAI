from pydantic import BaseModel
from typing import List


class InvestigationRequest(BaseModel):
    payment_id: str
    amount: float
    currency: str = "INR"
    status: str
    bank: str = ""
    method: str = ""
    error_code: str = ""
    error_message: str = ""


class InvestigationResponse(BaseModel):
    root_cause: str
    confidence: int
    evidence: List[str]
    recommendation: str