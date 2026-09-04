def check_payment_method(payment):

    method = payment.method.upper()

    if method == "UPI":
        return {
            "method": "UPI",
            "category": "DIGITAL_PAYMENT",
            "observation": "UPI payment detected"
        }

    if method == "CARD":
        return {
            "method": "CARD",
            "category": "CARD_PAYMENT",
            "observation": "Card payment detected"
        }

    if method == "NETBANKING":
        return {
            "method": "NETBANKING",
            "category": "BANKING_PAYMENT",
            "observation": "Net banking payment detected"
        }

    return {
        "method": method,
        "category": "UNKNOWN",
        "observation": "Unknown payment method"
    }