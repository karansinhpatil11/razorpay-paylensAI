const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      required: true,
    },

    method: {
      type: String,
      required: true,
    },

    bank: {
      type: String,
      required: true,
    },

    errorCode: {
      type: String,
      default: "",
    },

    errorMessage: {
      type: String,
      default: "",
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent OverwriteModelError
const Payment =
  mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);

module.exports = Payment;