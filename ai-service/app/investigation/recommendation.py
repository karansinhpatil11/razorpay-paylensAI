def generate_recommendation(root_cause):

    if root_cause == "Bank Authorization Issue":
        return (
            "Temporarily recommend an alternate payment method "
            "to affected users while monitoring bank authorization failures."
        )

    if root_cause == "UPI Transaction Failure":
        return (
            "Recommend an alternate payment method and monitor "
            "UPI transaction failures."
        )

    if root_cause == "Bank Processing Issue":
        return (
            "Monitor the affected bank and recommend alternate "
            "payment methods if failure rates continue increasing."
        )

    if root_cause == "Payment Processing Failure":
        return (
            "Investigate payment gateway and transaction processing "
            "logs for recurring failures."
        )

    return "Continue monitoring payment transactions."

