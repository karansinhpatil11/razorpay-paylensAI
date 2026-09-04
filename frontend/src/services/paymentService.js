import api from "./api";

// GET ALL PAYMENTS
export const getPayments = async (search = "") => {
  const response = await api.get("/payments", { params: { search } });

  return response.data;
};


// GET PAYMENT BY ID
export const getPaymentById = async (paymentId) => {
  const response = await api.get(`/payments/${encodeURIComponent(paymentId)}`);

  return response.data;
};
