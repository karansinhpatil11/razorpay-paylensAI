
import { useEffect, useState } from "react";
import { getPayments } from "../services/paymentService";

const usePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchPayments = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError("");
        }

        const response = await getPayments();

        console.log("PAYMENTS RESPONSE:", response);

        if (!isMounted) return;

        // Handles both:
        // { payments: [...] }
        // and
        // [...]

        const paymentData = Array.isArray(response)
          ? response
          : response?.payments || [];

        setPayments(paymentData);

      } catch (err) {
        console.error("PAYMENT ERROR:", err);

        if (!isMounted) return;

        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load payments"
        );

        setPayments([]);

      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPayments();

    return () => {
      isMounted = false;
    };
  }, []);

  // Manual reload function
  const reload = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPayments();

      console.log("RELOADED PAYMENTS:", response);

      const paymentData = Array.isArray(response)
        ? response
        : response?.payments || [];

      setPayments(paymentData);

    } catch (err) {
      console.error("PAYMENT RELOAD ERROR:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to reload payments"
      );

    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    loading,
    error,
    reload,
  };
};

export default usePayments;

