import api from "./api";

// Get all investigations
export const getInvestigations = async () => {
  const response = await api.get("/investigations");

  return response.data;
};

// Get investigation by payment ID
export const getInvestigationByPaymentId = async (paymentId) => {
  const response = await api.get(`/investigations/${encodeURIComponent(paymentId)}`);

  return response.data;
};

// AI Investigation
export const investigatePayment = async (paymentId) => {
  console.log("Calling AI investigation for:", paymentId);

  const response = await api.post("/ai/investigate", { paymentId });

  console.log("AI API RESPONSE:", response.data);

  // IMPORTANT
  return response.data;
};
