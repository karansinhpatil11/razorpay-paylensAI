
const axios = require("axios");

const Payment = require("../models/Payment");
const Investigation = require("../models/Investigation");

// ======================================================
// RUN AI INVESTIGATION
// POST /api/investigations/:paymentId/investigate
// ======================================================

const investigatePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    console.log("================================");
    console.log("AI INVESTIGATION");
    console.log("Payment ID:", paymentId);
    console.log("================================");

    // Find payment in MongoDB
    const payment = await Payment.findOne({
      paymentId: paymentId,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    console.log("Payment found:", payment);

    // Send payment information to FastAPI
    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL || "http://127.0.0.1:8000"}/api/investigate`,
      {
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        bank: payment.bank || "",
        method: payment.method || "",
        errorCode: payment.errorCode || "",
        errorMessage: payment.errorMessage || "",
      }
    );

    console.log("AI RESPONSE:", aiResponse.data);

    const aiResult = aiResponse.data;

    // Save investigation in MongoDB
    const investigation =
      await Investigation.findOneAndUpdate(
        {
          paymentId: paymentId,
        },
        {
          paymentId: paymentId,
          root_cause: aiResult.root_cause,
          confidence: aiResult.confidence,
          evidence: aiResult.evidence || [],
          recommendation:
            aiResult.recommendation || "",
        },
        {
          new: true,
          upsert: true,
        }
      );

    console.log(
      "Investigation saved:",
      investigation
    );

    // Return result to React
    return res.status(200).json({
      paymentId,
      riskScore: aiResult.riskScore,
      riskLevel: aiResult.riskLevel,
      root_cause: investigation.root_cause,
      confidence: investigation.confidence,
      evidence: investigation.evidence,
      recommendation:
        investigation.recommendation,
    });

  } catch (error) {
    console.error(
      "AI INVESTIGATION ERROR:",
      error
    );

    return res.status(500).json({
      message: "AI investigation failed",
      error: error.message,
    });
  }
};


// ======================================================
// GET ALL INVESTIGATIONS
// GET /api/investigations
// ======================================================

const getInvestigations = async (req, res) => {
  try {
    const investigations =
      await Investigation.find()
        .sort({ createdAt: -1 });

    return res.status(200).json({
      investigations,
    });

  } catch (error) {
    console.error(
      "GET INVESTIGATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch investigations",
      error: error.message,
    });
  }
};


// ======================================================
// GET SINGLE INVESTIGATION
// GET /api/investigations/:paymentId
// ======================================================

const getInvestigationById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Find payment
    const payment = await Payment.findOne({
      paymentId: paymentId,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // Find existing investigation
    const investigation =
      await Investigation.findOne({
        paymentId: paymentId,
      });

    return res.status(200).json({
      payment,
      investigation,
    });

  } catch (error) {
    console.error(
      "GET INVESTIGATION ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to load investigation",
      error: error.message,
    });
  }
};


// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
  investigatePayment,
  getInvestigations,
  getInvestigationById,
};
