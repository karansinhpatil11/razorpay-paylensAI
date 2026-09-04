import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analyticsService";
import { realtime } from "../services/realtime";

const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAnalytics();

        console.log("Analytics data:", data);

        setAnalytics(data);
      } catch (err) {
        console.error("Analytics error:", err);

        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();

    realtime.on("payment:changed", loadAnalytics);

    return () => {
      realtime.off("payment:changed", loadAnalytics);
    };
  }, []);

  return {
    analytics,
    loading,
    error,
  };
};

export default useAnalytics;
