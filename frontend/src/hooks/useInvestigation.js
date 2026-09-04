import { useEffect, useState } from "react";

import {
  getInvestigations,
} from "../services/investigationService";


const useInvestigations = () => {

  const [investigations, setInvestigations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const loadInvestigations = async () => {

    try {

      setLoading(true);

      setError("");


      const data =
        await getInvestigations();


      console.log(
        "INVESTIGATIONS:",
        data
      );


      setInvestigations(
        data?.investigations || []
      );

    } catch (err) {

      console.error(
        "INVESTIGATION ERROR:",
        err
      );


      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load investigations"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    const fetchInvestigations = async () => {

      await loadInvestigations();

    };


    fetchInvestigations();

  }, []);


  return {

    investigations,

    loading,

    error,

    reload: loadInvestigations,

  };

};


export default useInvestigations;