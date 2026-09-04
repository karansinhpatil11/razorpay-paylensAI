from pydantic import BaseModel
from typing import Optional


class Payment(BaseModel):
    paymentId: str
    amount: float
    currency: str = "INR"
    status: str
    bank: Optional[str] = ""
    method: Optional[str] = ""
    errorCode: Optional[str] = ""
    errorMessage: Optional[str] = ""