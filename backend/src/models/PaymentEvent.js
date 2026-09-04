const mongoose = require("mongoose");

const paymentEventSchema = new mongoose.Schema(
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
      default: "PENDING",
    },

    bank: {
      type: String,
      default: "",
    },

    method: {
      type: String,
      default: "",
    },

    errorCode: {
      type: String,
      default: "",
    },

    errorMessage: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true
  }
);

const PaymentEvent =
  mongoose.models.PaymentEvent ||
  mongoose.model("PaymentEvent", paymentEventSchema);

module.exports = PaymentEvent;