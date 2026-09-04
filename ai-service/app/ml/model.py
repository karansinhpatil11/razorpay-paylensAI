def predict_payment_risk(payment):

    error_code = payment.error_code.upper()

    if error_code in [
        "AUTH_FAILED",
        "BANK_AUTH_FAILED"
    ]:
        return {
            "risk": "HIGH",
            "score": 0.94
        }

    if error_code in [
        "TIMEOUT",
        "GATEWAY_TIMEOUT"
    ]:
        return {
            "risk": "HIGH",
            "score": 0.89
        }

    if payment.status.upper() == "FAILED":
        return {
            "risk": "MEDIUM",
            "score": 0.70
        }

    return {
        "risk": "LOW",
        "score": 0.20
    }