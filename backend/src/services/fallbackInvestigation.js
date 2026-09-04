const investigateLocally = (payment) => {
  const status = String(payment.status || "").trim().toUpperCase();
  const method = String(payment.method || "").trim().toUpperCase();
  const errorCode = String(payment.errorCode || "").trim().toUpperCase();
  const errorMessage = String(payment.errorMessage || "").trim();

  let rootCause = "No Significant Issue Detected";
  let confidence = 60;
  let riskScore = 15;
  let recommendation = "Continue monitoring this payment transaction.";

  if (["AUTH_FAILED", "BANK_AUTH_FAILED"].includes(errorCode) || /authoriz/i.test(errorMessage)) {
    rootCause = "Bank Authorization Issue";
    confidence = 94;
    riskScore = 85;
    recommendation = "Ask the customer to retry with another payment method and monitor bank authorization failures.";
  } else if (["TIMEOUT", "GATEWAY_TIMEOUT"].includes(errorCode) || /timeout/i.test(errorMessage)) {
    rootCause = "Payment Gateway Timeout";
    confidence = 91;
    riskScore = 78;
    recommendation = "Retry safely only after confirming no duplicate charge, then monitor gateway latency.";
  } else if (["INSUFFICIENT_FUNDS", "INSUFFICIENT_BALANCE"].includes(errorCode)) {
    rootCause = "Insufficient Funds";
    confidence = 98;
    riskScore = 35;
    recommendation = "Ask the customer to use a funded account or another payment method.";
  } else if (status === "FAILED" && method === "UPI") {
    rootCause = "UPI Transaction Failure";
    confidence = 85;
    riskScore = 70;
    recommendation = "Suggest another UPI app or payment method and monitor UPI failure rates.";
  } else if (status === "FAILED" && payment.bank) {
    rootCause = "Bank Processing Issue";
    confidence = 80;
    riskScore = 65;
    recommendation = "Monitor the affected bank and offer an alternative method if failures persist.";
  } else if (status === "FAILED") {
    rootCause = "Payment Processing Failure";
    confidence = 75;
    riskScore = 55;
    recommendation = "Review gateway and transaction logs for recurring processing failures.";
  }

  const evidence = [
    `Payment status: ${status || "not provided"}.`,
    `Payment method: ${method || "not provided"}.`,
  ];
  if (payment.bank) evidence.push(`Bank involved: ${payment.bank}.`);
  if (errorCode) evidence.push(`Error code: ${errorCode}.`);
  if (errorMessage) evidence.push(`Error message: ${errorMessage}.`);
  evidence.push(`Probable root cause: ${rootCause}.`);

  return {
    paymentId: payment.paymentId,
    riskScore,
    riskLevel: riskScore >= 70 ? "HIGH" : riskScore >= 40 ? "MEDIUM" : "LOW",
    root_cause: rootCause,
    confidence,
    evidence,
    recommendation,
    analysisSource: "local-fallback",
  };
};

module.exports = { investigateLocally };
