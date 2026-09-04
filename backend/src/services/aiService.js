const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const investigatePayment = async (payment) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/investigate`,
      payment,
      { timeout: 10000 }
    );

    return response.data;
  } catch (error) {
    console.error(
      "AI Service Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};
module.exports = { investigatePayment };
