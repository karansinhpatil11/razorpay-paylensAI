def check_bank_rule(payment):

    bank = payment.bank.upper()

    if bank == "HDFC":
        return {
            "bank": "HDFC",
            "observation": "HDFC transaction detected",
            "risk": "MEDIUM"
        }

    if bank == "ICICI":
        return {
            "bank": "ICICI",
            "observation": "ICICI transaction detected",
            "risk": "MEDIUM"
        }

    if bank == "SBI":
        return {
            "bank": "SBI",
            "observation": "SBI transaction detected",
            "risk": "MEDIUM"
        }

    return {
        "bank": bank,
        "observation": "Unknown bank",
        "risk": "LOW"
    }