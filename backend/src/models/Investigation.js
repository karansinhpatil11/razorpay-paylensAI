
const mongoose = require("mongoose");

const investigationSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },

    root_cause: {
      type: String,
      default: "",
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    riskLevel: {
      type: String,
      default: "LOW",
    },

    confidence: {
      type: Number,
      default: 0,
    },

    evidence: {
      type: [String],
      default: [],
    },

    recommendation: {
      type: String,
      default: "",
    },

    analysisSource: {
      type: String,
      default: "fastapi",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Investigation ||
  mongoose.model(
    "Investigation",
    investigationSchema
  );

