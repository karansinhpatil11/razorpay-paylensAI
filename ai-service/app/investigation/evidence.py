def generate_evidence(payment, root_cause):

    evidence = []

    if payment.status == "FAILED":
        evidence.append(
            "Payment transaction was marked as FAILED."
        )

    if payment.bank:
        evidence.append(
            f"{payment.bank} was involved in the failed transaction."
        )

    if payment.method:
        evidence.append(
            f"Payment method detected: {payment.method}."
        )

    if payment.error_message:
        evidence.append(
            f"Payment error: {payment.error_message}."
        )

    evidence.append(
        f"AI identified the probable root cause as: {root_cause}."
    )

    return evidence