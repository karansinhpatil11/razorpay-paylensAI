def create_features(payment):
    """
    Convert payment information into numerical features.
    """

    status = payment.status.upper()
    method = payment.method.upper()
    bank = payment.bank.upper()

    features = {
        "amount": payment.amount,

        "is_failed": 1 if status == "FAILED" else 0,

        "is_upi": 1 if method == "UPI" else 0,

        "is_card": 1 if method == "CARD" else 0,

        "is_netbanking": 1 if method == "NETBANKING" else 0,

        "is_hdfc": 1 if bank == "HDFC" else 0,

        "is_icici": 1 if bank == "ICICI" else 0,

        "is_sbi": 1 if bank == "SBI" else 0
    }

    return features