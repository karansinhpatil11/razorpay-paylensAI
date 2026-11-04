import json
import logging
from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field

from app.config import GEMINI_API_KEY, GEMINI_MODEL

logger = logging.getLogger("paylens.gemini")

# ============================================================================
# Schemas for Gemini Structured Output
# ============================================================================

class InvestigationOutput(BaseModel):
    root_cause: str = Field(description="Technical root cause of the payment failure")
    confidence: int = Field(description="Confidence percentage 0 to 100")
    riskScore: int = Field(description="Calculated risk score 0 to 100")
    riskLevel: Literal["LOW", "MEDIUM", "HIGH"] = Field(description="Risk categorization")
    evidence: List[str] = Field(description="3 to 5 factual bullet points explaining why this failure occurred")
    recommendation: str = Field(description="Concrete operational advice for merchant and customer")


class IncidentItemAnalysis(BaseModel):
    id: str = Field(description="Incident ID such as INC-001")
    title: str = Field(description="Descriptive title of the incident")
    severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"] = Field(description="Incident severity level")
    root_cause_hypothesis: str = Field(description="Detailed technical hypothesis of the failure spike")
    blast_radius: str = Field(description="Impacted systems, methods, or customer segments")
    mitigation_step: str = Field(description="Immediate operational mitigation for the payment ops team")


class IncidentsReportOutput(BaseModel):
    incident_summary: str = Field(description="Executive summary of ongoing payment incidents")
    platform_health: Literal["HEALTHY", "DEGRADED", "CRITICAL"] = Field(description="Overall platform payment health")
    action_items: List[str] = Field(description="Immediate prioritized actions to restore success rates")
    incidents: List[IncidentItemAnalysis] = Field(description="Deep analysis for each incident")


class AnalyticsInsightsOutput(BaseModel):
    healthScore: int = Field(description="Platform transaction health score from 0 to 100")
    healthStatus: Literal["EXCELLENT", "HEALTHY", "DEGRADED", "CRITICAL"] = Field(description="Overall health status")
    executiveSummary: str = Field(description="Concise 2-3 sentence overview of payment health and performance")
    keyObservations: List[str] = Field(description="3-4 bullet observations on patterns, banks, and payment channels")
    topFailureDrivers: List[str] = Field(description="Top 2-3 root causes driving transaction drop-offs")
    estimatedRevenueRisk: str = Field(description="Assessment of revenue or volume affected by failed payments")
    actionableRecommendations: List[str] = Field(description="3-4 concrete actions to improve authorization rate and reduce failures")


# ============================================================================
# Gemini Client Helper
# ============================================================================

def _get_gemini_client():
    if not GEMINI_API_KEY or GEMINI_API_KEY.strip() == "" or "your_" in GEMINI_API_KEY.lower():
        return None
    try:
        from google import genai
        return genai.Client(api_key=GEMINI_API_KEY.strip())
    except Exception as e:
        logger.warning(f"Failed to initialize google-genai client: {e}")
        return None


# ============================================================================
# 1. AI Payment Investigator
# ============================================================================

def investigate_with_gemini(payment: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    client = _get_gemini_client()
    if not client:
        return None

    try:
        from google.genai import types

        prompt = f"""
You are an expert Payment Systems & Banking Operations Forensic AI for PayLens AI.
Analyze the following payment transaction details in the context of Indian fintech/banking rails (UPI, IMPS, Cards, Netbanking):

- Payment ID: {payment.get("paymentId", "N/A")}
- Amount: {payment.get("currency", "INR")} {payment.get("amount", 0)}
- Status: {payment.get("status", "N/A")}
- Bank: {payment.get("bank") or "Not provided"}
- Payment Method: {payment.get("method") or "Not provided"}
- Error Code: {payment.get("errorCode") or "None"}
- Error Message: {payment.get("errorMessage") or "None"}
- Timestamp: {payment.get("timestamp") or "N/A"}

Provide an authoritative root cause analysis, risk score (0-100), risk level (LOW/MEDIUM/HIGH), confidence (0-100), technical evidence points, and concrete operational recommendations for the merchant and consumer.
"""

        # Try models in order of priority (free tier models)
        models_to_try = [
            GEMINI_MODEL,
            "gemini-2.5-flash",
            "gemini-1.5-flash",
            "gemini-3.8-flash",
        ]
        # Remove duplicates while preserving order
        unique_models = list(dict.fromkeys(models_to_try))

        for model in unique_models:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=InvestigationOutput,
                        temperature=0.2,
                    ),
                )
                if response.text:
                    parsed = json.loads(response.text)
                    parsed["paymentId"] = payment.get("paymentId")
                    parsed["analysisSource"] = f"gemini ({model})"
                    return parsed
            except Exception as model_err:
                logger.warning(f"Gemini model {model} investigation call failed: {model_err}")
                continue

    except Exception as exc:
        logger.error(f"Error calling Gemini for payment investigation: {exc}")

    return None


# ============================================================================
# 2. AI Incident Analyzer
# ============================================================================

def analyze_incidents_with_gemini(incidents: List[Dict[str, Any]], failed_payments: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    client = _get_gemini_client()
    if not client:
        return None

    try:
        from google.genai import types

        # Prepare summary of incidents
        incident_summary_list = []
        for inc in incidents:
            incident_summary_list.append({
                "id": inc.get("id"),
                "title": inc.get("title"),
                "bank": inc.get("bank"),
                "method": inc.get("method"),
                "affectedCount": inc.get("affectedPayments", len(inc.get("payments", []))),
                "sampleErrors": [
                    f"{p.get('errorCode', '')}: {p.get('errorMessage', '')}"
                    for p in inc.get("payments", [])[:3]
                ],
            })

        prompt = f"""
You are the Incident Commander AI for PayLens AI Payment Operations.
Review these active payment failure incident clusters and recent failure telemetry:

Active Incidents:
{json.dumps(incident_summary_list, indent=2)}

Total Recent Failed Payments Sample Size: {len(failed_payments)}

Provide a structured incident assessment:
1. An overall executive incident summary of the payment ecosystem state.
2. Platform health evaluation (HEALTHY, DEGRADED, CRITICAL).
3. Immediate prioritized operational action items (e.g. routing rule tweaks, switch to secondary payment gateway, issuer bank degradation notice).
4. For each incident, evaluate true severity, root cause hypothesis, blast radius, and specific mitigation step.
"""

        models_to_try = [
            GEMINI_MODEL,
            "gemini-2.5-flash",
            "gemini-1.5-flash",
            "gemini-3.8-flash",
        ]
        unique_models = list(dict.fromkeys(models_to_try))

        for model in unique_models:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=IncidentsReportOutput,
                        temperature=0.2,
                    ),
                )
                if response.text:
                    parsed = json.loads(response.text)
                    parsed["analysisSource"] = f"gemini ({model})"
                    return parsed
            except Exception as model_err:
                logger.warning(f"Gemini model {model} incident call failed: {model_err}")
                continue

    except Exception as exc:
        logger.error(f"Error calling Gemini for incidents analysis: {exc}")

    return None


# ============================================================================
# 3. AI Analytics Intelligence
# ============================================================================

def analyze_analytics_with_gemini(analytics_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    client = _get_gemini_client()
    if not client:
        return None

    try:
        from google.genai import types

        summary = analytics_data.get("summary", {})
        banks = analytics_data.get("banks", [])
        methods = analytics_data.get("methods", [])
        status = analytics_data.get("status", [])

        prompt = f"""
You are a Principal Payment Analytics AI for PayLens AI.
Analyze the following payment conversion and failure dataset:

- Total Transactions: {summary.get("totalPayments", 0)}
- Successful Transactions: {summary.get("successfulPayments", 0)}
- Failed Transactions: {summary.get("failedPayments", 0)}
- Failure Rate: {summary.get("failureRate", 0)}%
- Total Processed Amount: INR {summary.get("totalAmount", 0)}
- Payment Status Breakdown: {json.dumps(status)}
- Failures by Bank: {json.dumps(banks)}
- Failures by Method: {json.dumps(methods)}

Provide an executive intelligence assessment:
1. Health score (0 to 100) and Health Status (EXCELLENT, HEALTHY, DEGRADED, CRITICAL).
2. Concise executive summary of conversion trends and bottlenecks.
3. Key observations identifying disproportionate failure concentrations.
4. Top failure drivers.
5. Estimated revenue/turnover at risk.
6. Actionable recommendations (smart routing, issuer-specific retry rules, user payment method nudging).
"""

        models_to_try = [
            GEMINI_MODEL,
            "gemini-2.5-flash",
            "gemini-1.5-flash",
            "gemini-3.8-flash",
        ]
        unique_models = list(dict.fromkeys(models_to_try))

        for model in unique_models:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=AnalyticsInsightsOutput,
                        temperature=0.2,
                    ),
                )
                if response.text:
                    parsed = json.loads(response.text)
                    parsed["analysisSource"] = f"gemini ({model})"
                    return parsed
            except Exception as model_err:
                logger.warning(f"Gemini model {model} analytics call failed: {model_err}")
                continue

    except Exception as exc:
        logger.error(f"Error calling Gemini for analytics analysis: {exc}")

    return None
