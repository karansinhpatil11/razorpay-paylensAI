def check_failure_rule(payment):
    """
    Analyze payment error information.
    """

    error_code = payment.error_code.upper()
    error_message = payment.error_message.upper()

    if error_code in ["AUTH_FAILED", "BANK_AUTH_FAILED"]:
        return {
            "rule": "BANK_AUTHORIZATION_FAILURE",
            "cause": "Bank Authorization Issue",
            "confidence": 94
        }

    if error_code in ["TIMEOUT", "GATEWAY_TIMEOUT"]:
        return {
            "rule": "PAYMENT_TIMEOUT",
            "cause": "Payment Gateway Timeout",
            "confidence": 91
        }

    if error_code in ["INSUFFICIENT_FUNDS", "INSUFFICIENT_BALANCE"]:
        return {
            "rule": "INSUFFICIENT_FUNDS",
            "cause": "Insufficient Funds",
            "confidence": 98
        }

    if "DECLINED" in error_message:
        return {
            "rule": "BANK_DECLINED",
            "cause": "Bank Declined Transaction",
            "confidence": 92
        }

    return {
        "rule": "UNKNOWN_FAILURE",
        "cause": "Unknown Payment Failure",
        "confidence": 60
    }