import { useEffect, useState } from "react";
import { getIncidents } from "../services/incidentService";

const useIncidents = () => {

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const loadIncidents = async () => {

      try {

        const data = await getIncidents();

        console.log("INCIDENTS:", data);

        setIncidents(data?.incidents || []);

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


    // Initial API call
    loadIncidents();


    // Auto refresh every 5 seconds
    const interval = setInterval(() => {

      loadIncidents();

    }, 5000);


    // Cleanup
    return () => {

      clearInterval(interval);

    };

  }, []);


  return {

    incidents,
    loading,
    error,

  };

};


export default useIncidents;