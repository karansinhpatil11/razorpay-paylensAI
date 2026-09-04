from app.investigation.root_cause import detect_root_cause
from app.investigation.evidence import generate_evidence
from app.investigation.recommendation import generate_recommendation


def investigate_payment(payment):

    root_cause, confidence = detect_root_cause(payment)

    evidence = generate_evidence(
        payment,
        root_cause
    )

    recommendation = generate_recommendation(
        root_cause
    )

    return {
        "root_cause": root_cause,
        "confidence": confidence,
        "evidence": evidence,
        "recommendation": recommendation
    }