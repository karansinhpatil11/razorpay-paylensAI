import api from "./api";

export const investigatePayment = async (paymentId) => {
  const response = await api.post("/ai/investigate", { paymentId });

  return response.data;
};
