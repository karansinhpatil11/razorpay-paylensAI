from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="PayLens AI Service", version="1.0.0")


class PaymentRequest(BaseModel):
    paymentId: str
    amount: float = Field(ge=0)
    currency: str = "INR"
    status: str
    bank: str = ""
    method: str = ""
    errorCode: str = ""
    errorMessage: str = ""


def analyze(payment: PaymentRequest) -> dict:
    status = payment.status.upper().strip()
    method = payment.method.upper().strip()
    error_code = payment.errorCode.upper().strip()
    error_message = payment.errorMessage.strip()
    root_cause, confidence, risk_score = "No Significant Issue Detected", 60, 15
    recommendation = "Continue monitoring this payment transaction."

    if error_code in {"AUTH_FAILED", "BANK_AUTH_FAILED"} or "authoriz" in error_message.lower():
        root_cause, confidence, risk_score = "Bank Authorization Issue", 94, 85
        recommendation = "Ask the customer to retry with another payment method and monitor bank authorization failures."
    elif error_code in {"TIMEOUT", "GATEWAY_TIMEOUT"} or "timeout" in error_message.lower():
        root_cause, confidence, risk_score = "Payment Gateway Timeout", 91, 78
        recommendation = "Retry safely only after confirming no duplicate charge, then monitor gateway latency."
    elif error_code in {"INSUFFICIENT_FUNDS", "INSUFFICIENT_BALANCE"}:
        root_cause, confidence, risk_score = "Insufficient Funds", 98, 35
        recommendation = "Ask the customer to use a funded account or another payment method."
    elif status == "FAILED" and method == "UPI":
        root_cause, confidence, risk_score = "UPI Transaction Failure", 85, 70
        recommendation = "Suggest another UPI app or payment method and monitor UPI failure rates."
    elif status == "FAILED" and payment.bank:
        root_cause, confidence, risk_score = "Bank Processing Issue", 80, 65
        recommendation = "Monitor the affected bank and offer an alternative method if failures persist."
    elif status == "FAILED":
        root_cause, confidence, risk_score = "Payment Processing Failure", 75, 55
        recommendation = "Review gateway and transaction logs for recurring processing failures."

    evidence = [f"Payment status: {status}.", f"Payment method: {method or 'not provided' }."]
    if payment.bank:
        evidence.append(f"Bank involved: {payment.bank}.")
    if error_code:
        evidence.append(f"Error code: {error_code}.")
    if error_message:
        evidence.append(f"Error message: {error_message}.")
    evidence.append(f"Probable root cause: {root_cause}.")
    risk_level: Literal["LOW", "MEDIUM", "HIGH"] = "HIGH" if risk_score >= 70 else "MEDIUM" if risk_score >= 40 else "LOW"
    return {"paymentId": payment.paymentId, "riskScore": risk_score, "riskLevel": risk_level, "root_cause": root_cause, "confidence": confidence, "evidence": evidence, "recommendation": recommendation}


@app.get("/")
def root():
    return {"message": "PayLens AI Service is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/investigate")
def investigate(payment: PaymentRequest):
    return analyze(payment)


@app.post("/api/predict-risk")
def predict_risk(payment: PaymentRequest):
    result = analyze(payment)
    return {"risk": result["riskLevel"], "score": result["riskScore"] / 100}
