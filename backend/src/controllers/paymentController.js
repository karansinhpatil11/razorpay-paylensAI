const Payment = require("../models/Payment");

// GET all payments + SEARCH
const getPayments = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      query = {
        $or: [
          { paymentId: searchRegex },
          { bank: searchRegex },
          { method: searchRegex },
          { status: searchRegex },
          { customerId: searchRegex },
          { email: searchRegex },
        ],
      };
    }

    const payments = await Payment.find(query).sort({ timestamp: -1, createdAt: -1 });

    res.status(200).json(payments);

  } catch (error) {
    console.error("Get payments error:", error);

    res.status(500).json({
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};


// GET single payment
const getPaymentById = async (req, res) => {
  try {
    const isObjectId = /^[a-f\d]{24}$/i.test(req.params.id);
    const payment = await Payment.findOne({
      $or: [{ paymentId: req.params.id }, ...(isObjectId ? [{ _id: req.params.id }] : [])],
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json(payment);

  } catch (error) {
    console.error("Get payment error:", error);

    res.status(500).json({
      message: "Failed to fetch payment",
      error: error.message,
    });
  }
};


// CREATE payment
const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);

    res.status(201).json(payment);

  } catch (error) {
    console.error("Create payment error:", error);

    res.status(400).json({
      message: "Failed to create payment",
      error: error.message,
    });
  }
};


module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
};
