const Payment = require("../models/Payment");
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

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
module.exports = { investigate };
