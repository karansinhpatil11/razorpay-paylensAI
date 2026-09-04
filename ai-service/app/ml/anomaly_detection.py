def detect_anomaly(
    current_failure_rate,
    baseline_failure_rate
):
    """
    Detect whether the current failure rate
    is significantly higher than the baseline.
    """

    if baseline_failure_rate <= 0:
        return {
            "is_anomaly": False,
            "severity": "UNKNOWN",
            "change_ratio": 0
        }

    change_ratio = (
        current_failure_rate /
        baseline_failure_rate
    )

    if change_ratio >= 5:
        severity = "CRITICAL"
        is_anomaly = True

    elif change_ratio >= 3:
        severity = "HIGH"
        is_anomaly = True

    elif change_ratio >= 2:
        severity = "MEDIUM"
        is_anomaly = True

    else:
        severity = "LOW"
        is_anomaly = False

    return {
        "is_anomaly": is_anomaly,
        "severity": severity,
        "change_ratio": round(change_ratio, 2)
    }