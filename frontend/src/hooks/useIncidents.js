import { useEffect, useState } from "react";
import { getIncidents } from "../services/incidentService";
import { realtime } from "../services/realtime";

const useIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [aiReport, setAiReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const data = await getIncidents();
        setIncidents(data?.incidents || []);
        setAiReport(data?.aiReport || null);
        setError("");
      } catch (err) {
        console.error("INCIDENT ERROR:", err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load incidents"
        );
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
    realtime.on("payment:changed", loadIncidents);

    return () => {
      realtime.off("payment:changed", loadIncidents);
    };
  }, []);

  return {
    incidents,
    aiReport,
    loading,
    error,
  };
};

export default useIncidents;
