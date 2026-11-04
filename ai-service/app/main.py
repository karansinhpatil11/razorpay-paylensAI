from typing import Any, Dict, List, Literal, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.config import GEMINI_API_KEY, GEMINI_MODEL
from app.ai.llm import (
    investigate_with_gemini,
    analyze_incidents_with_gemini,
    analyze_analytics_with_gemini,
)

app = FastAPI(title="PayLens AI Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PaymentRequest(BaseModel):
    paymentId: str
    amount: float = Field(ge=0, default=0.0)
    currency: str = "INR"
    status: str
    bank: str = ""
    method: str = ""
    errorCode: str = ""
    errorMessage: str = ""
    timestamp: str = ""


class IncidentsAnalysisRequest(BaseModel):
    incidents: List[Dict[str, Any]] = []
    failedPayments: List[Dict[str, Any]] = []


class AnalyticsInsightsRequest(BaseModel):
    summary: Dict[str, Any] = {}
    status: List[Dict[str, Any]] = []
    banks: List[Dict[str, Any]] = []
    methods: List[Dict[str, Any]] = []


# ============================================================================
# Rule-Based Heuristic Fallbacks
# ============================================================================

def analyze_rule_based(payment: PaymentRequest) -> dict:
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

    evidence = [f"Payment status: {status}.", f"Payment method: {method or 'not provided'}."]
    if payment.bank:
        evidence.append(f"Bank involved: {payment.bank}.")
    if error_code:
        evidence.append(f"Error code: {error_code}.")
    if error_message:
        evidence.append(f"Error message: {error_message}.")
    evidence.append(f"Probable root cause: {root_cause}.")
    risk_level: Literal["LOW", "MEDIUM", "HIGH"] = "HIGH" if risk_score >= 70 else "MEDIUM" if risk_score >= 40 else "LOW"
    return {
        "paymentId": payment.paymentId,
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "root_cause": root_cause,
        "confidence": confidence,
        "evidence": evidence,
        "recommendation": recommendation,
        "analysisSource": "heuristic-rules",
    }


def fallback_incidents_analysis(incidents: List[Dict[str, Any]], failed_payments: List[Dict[str, Any]]) -> dict:
    total_affected = sum(inc.get("affectedPayments", len(inc.get("payments", []))) for inc in incidents)
    highest_severity = "LOW"
    analyzed = []

    for inc in incidents:
        count = inc.get("affectedPayments", len(inc.get("payments", [])))
        bank = inc.get("bank", "Unknown")
        method = inc.get("method", "Unknown")
        severity = "HIGH" if count >= 5 else "MEDIUM" if count >= 3 else "LOW"
        if severity == "HIGH":
            highest_severity = "HIGH"
        elif severity == "MEDIUM" and highest_severity != "HIGH":
            highest_severity = "MEDIUM"

        analyzed.append({
            "id": inc.get("id"),
            "title": inc.get("title", f"{bank} {method} Failure Spike"),
            "severity": severity,
            "root_cause_hypothesis": f"Elevated timeout and authorization degradation detected at {bank} {method} processing pipeline.",
            "blast_radius": f"{count} transactions impacted across {bank} {method} rails.",
            "mitigation_step": f"Enable dynamic traffic shifting to alternative routes for {bank} and prompt user to retry.",
        })

    platform_health = "CRITICAL" if highest_severity == "HIGH" else "DEGRADED" if highest_severity == "MEDIUM" else "HEALTHY"
    summary_text = (
        f"{len(incidents)} active incident(s) detected affecting {total_affected} transactions. "
        f"Primary failure concentration is in {incidents[0].get('bank', 'issuer')} {incidents[0].get('method', 'channel')}."
        if incidents else "All payment rails operating normally with zero active incident clusters."
    )

    return {
        "incident_summary": summary_text,
        "platform_health": platform_health,
        "action_items": [
            "Monitor gateway latency and error rates on affected bank routes.",
            "Consider enabling automatic routing failover for degraded channels.",
            "Update checkout messaging with payment method health indicators.",
        ],
        "incidents": analyzed,
        "analysisSource": "heuristic-engine",
    }


def fallback_analytics_insights(data: Dict[str, Any]) -> dict:
    summary = data.get("summary", {})
    total = summary.get("totalPayments", 0)
    failed = summary.get("failedPayments", 0)
    failure_rate = summary.get("failureRate", 0.0)
    banks = data.get("banks", [])
    methods = data.get("methods", [])

    health_score = max(0, min(100, int(100 - (failure_rate * 1.5))))
    health_status = (
        "EXCELLENT" if health_score >= 85
        else "HEALTHY" if health_score >= 70
        else "DEGRADED" if health_score >= 50
        else "CRITICAL"
    )

    top_bank = banks[0].get("bank", "Unknown") if banks else "N/A"
    top_method = methods[0].get("method", "Unknown") if methods else "N/A"

    return {
        "healthScore": health_score,
        "healthStatus": health_status,
        "executiveSummary": (
            f"Overall platform health is {health_status} with a {failure_rate}% failure rate across {total} transactions. "
            f"Failure concentration is highest in {top_bank} and {top_method} channels."
        ),
        "keyObservations": [
            f"Current transaction failure rate is {failure_rate}%.",
            f"Highest volume of payment failures originated from {top_bank}.",
            f"{top_method} has the highest payment failure frequency among all payment methods.",
        ],
        "topFailureDrivers": [
            f"{top_bank} authorization timeouts and gateway latency.",
            f"Declined authorizations on {top_method} transactions.",
        ],
        "estimatedRevenueRisk": f"Approximately INR {failed * 1200} in pending or abandoned transactions.",
        "actionableRecommendations": [
            f"Configure smart fallback routing for {top_bank} to alternate acquiring banks.",
            f"Add intelligent retry nudges on checkout when {top_method} experiences degradation.",
            "Track real-time bank switch latency to preemptively reroute traffic.",
        ],
        "analysisSource": "heuristic-engine",
    }


# ============================================================================
# API Routes
# ============================================================================

@app.get("/")
def root():
    return {
        "message": "PayLens AI Service is running",
        "gemini_enabled": bool(GEMINI_API_KEY),
        "model": GEMINI_MODEL,
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "gemini_configured": bool(GEMINI_API_KEY),
        "model": GEMINI_MODEL,
    }


@app.post("/api/investigate")
def investigate(payment: PaymentRequest):
    # 1. Try Gemini
    gemini_result = investigate_with_gemini(payment.model_dump())
    if gemini_result:
        return gemini_result

    # 2. Fallback to heuristic rule analysis
    return analyze_rule_based(payment)


@app.post("/api/predict-risk")
def predict_risk(payment: PaymentRequest):
    result = investigate_with_gemini(payment.model_dump()) or analyze_rule_based(payment)
    return {"risk": result.get("riskLevel", "LOW"), "score": result.get("riskScore", 15) / 100}


@app.post("/api/incidents/analyze")
def analyze_incidents(req: IncidentsAnalysisRequest):
    # 1. Try Gemini
    gemini_report = analyze_incidents_with_gemini(req.incidents, req.failedPayments)
    if gemini_report:
        return gemini_report

    # 2. Fallback to heuristic analysis
    return fallback_incidents_analysis(req.incidents, req.failedPayments)


@app.post("/api/analytics/insights")
def analyze_analytics(req: AnalyticsInsightsRequest):
    data = req.model_dump()
    # 1. Try Gemini
    gemini_insights = analyze_analytics_with_gemini(data)
    if gemini_insights:
        return gemini_insights

    # 2. Fallback to heuristic analysis
    return fallback_analytics_insights(data)
