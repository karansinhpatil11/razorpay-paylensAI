def detect_root_cause(payment):

    error_code = payment.error_code.lower()
    error_message = payment.error_message.lower()
    bank = payment.bank.lower()
    method = payment.method.lower()

    # Bank authorization issue
    if (
        "authorization" in error_message
        or "auth" in error_code
    ):
        return "Bank Authorization Issue", 94

    # UPI issue
    if method == "upi" and (
        "upi" in error_message
        or "timeout" in error_message
    ):
        return "UPI Transaction Failure", 91

    # Bank-specific issue
    if bank and payment.status == "FAILED":
        return "Bank Processing Issue", 85

    # Generic failure
    if payment.status == "FAILED":
        return "Payment Processing Failure", 78

    return "No Significant Issue Detected", 60