const Payment = require("../models/Payment");
const Investigation = require("../models/Investigation");
const { investigatePayment } = require("../services/aiService");

const investigate = async (req, res, next) => {
  try {
    const paymentId = String(req.body.paymentId || "").trim();

    if (!paymentId) {
      return res.status(400).json({
        message: "paymentId is required",
      });
    }

    const payment = await Payment.findOne({ paymentId });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    const result = await investigatePayment(payment.toObject());

    // Save investigation in database
    await Investigation.findOneAndUpdate(
      { paymentId },
      {
        paymentId,
        root_cause: result.root_cause || result.rootCause || "",
        confidence: result.confidence || 0,
        riskScore: result.riskScore || 0,
        riskLevel: result.riskLevel || "LOW",
        evidence: result.evidence || [],
        recommendation: result.recommendation || "",
        analysisSource: result.analysisSource || "fastapi",
      },
      { upsert: true, new: true }
    );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
module.exports = { investigate };
