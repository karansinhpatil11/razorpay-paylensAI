const axios = require("axios");
const { investigateLocally } = require("./fallbackInvestigation");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const investigatePayment = async (payment) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/investigate`,
      payment,
      { timeout: 5000 }
    );

    return { ...response.data, analysisSource: "fastapi" };
  } catch (error) {
    console.error(
      "FastAPI investigation unavailable; using local fallback:",
      error.response?.data || error.message
    );

    return investigateLocally(payment);
  }
};
module.exports = { investigatePayment };
