const axios = require("axios");
const { investigateLocally } = require("./fallbackInvestigation");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const investigatePayment = async (payment) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/investigate`,
      payment,
      { timeout: 15000 }
    );

    return { ...response.data, analysisSource: response.data.analysisSource || "fastapi" };
  } catch (error) {
    console.warn(
      "AI Service investigation unavailable; using local fallback:",
      error.response?.data || error.message
    );

    return investigateLocally(payment);
  }
};

const analyzeIncidents = async (incidents, failedPayments = []) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/incidents/analyze`,
      { incidents, failedPayments },
      { timeout: 15000 }
    );

    return response.data;
  } catch (error) {
    console.warn(
      "AI Service incidents analysis unavailable; using fallback:",
      error.response?.data || error.message
    );

    return null;
  }
};

const getAnalyticsInsights = async (analyticsData) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/analytics/insights`,
      analyticsData,
      { timeout: 15000 }
    );

    return response.data;
  } catch (error) {
    console.warn(
      "AI Service analytics insights unavailable; using fallback:",
      error.response?.data || error.message
    );

    return null;
  }
};

module.exports = {
  investigatePayment,
  analyzeIncidents,
  getAnalyticsInsights,
};
