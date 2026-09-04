const axios = require("axios");
const Payment = require("../models/Payment");
const { investigateLocally } = require("../services/fallbackInvestigation");

const predictPaymentRisk = async (req, res) => {
  try {
    const { paymentId } = req.params;

    console.log("Risk prediction requested for:", paymentId);

    const payment = await Payment.findOne({
      paymentId,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    let riskData;
    try {
      const aiResponse = await axios.post(
        `${process.env.AI_SERVICE_URL || "http://127.0.0.1:8000"}/api/predict-risk`,
        {
          paymentId: payment.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          method: payment.method,
          bank: payment.bank,
          status: payment.status,
          errorCode: payment.errorCode,
          errorMessage: payment.errorMessage,
        },
        { timeout: 5000 }
      );
      riskData = aiResponse.data;
    } catch (aiErr) {
      console.warn("FastAPI predict-risk unavailable, using local calculation:", aiErr.message);
      const local = investigateLocally(payment.toObject());
      riskData = {
        risk: local.riskLevel,
        score: Number((local.riskScore / 100).toFixed(2)),
        source: "local-fallback",
      };
    }

    return res.status(200).json({
      paymentId: payment.paymentId,
      amount: payment.amount,
      bank: payment.bank,
      method: payment.method,
      status: payment.status,
      risk: riskData,
    });
  } catch (error) {
    console.error("Risk prediction error:", error.message);
    return res.status(500).json({
      message: "Risk prediction failed",
      error: error.response?.data || error.message,
    });
  }
};


module.exports = {
  predictPaymentRisk,
};
