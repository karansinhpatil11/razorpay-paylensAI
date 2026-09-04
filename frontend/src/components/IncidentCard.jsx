
import {
  AlertTriangle,
  ShieldAlert,
  Brain,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


function IncidentCard({ incident }) {

  const navigate = useNavigate();


  if (!incident) {
    return null;
  }


  // ==========================================
  // SEVERITY
  // ==========================================

  const severity = String(
    incident.severity || "LOW"
  ).toUpperCase();


  const severityClass =
    severity === "HIGH"
      ? "bg-red-100 text-red-700"
      : severity === "MEDIUM"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";


  // ==========================================
  // GET PAYMENT ID
  // ==========================================

  const getPaymentId = () => {

    // First failed payment

    const failedPayment =
      incident?.payments?.find(
        (payment) =>
          String(
            payment?.status || ""
          ).toUpperCase() === "FAILED"
      );


    if (failedPayment?.paymentId) {

      return failedPayment.paymentId;

    }


    // Fallback: first payment

    const firstPayment =
      incident?.payments?.[0];


    if (firstPayment?.paymentId) {

      return firstPayment.paymentId;

    }


    return null;

  };


  // ==========================================
  // AI INVESTIGATE
  // ==========================================

  const handleInvestigate = () => {

    console.log(
      "================================"
    );

    console.log(
      "AI INVESTIGATION CLICKED"
    );

    console.log(
      "INCIDENT:",
      incident
    );


    const paymentId =
      getPaymentId();


    console.log(
      "PAYMENT ID:",
      paymentId
    );


    if (!paymentId) {

      alert(
        "No payment ID found for this incident."
      );

      return;

    }


    // Navigate to investigation page

    navigate(
      `/investigation/${paymentId}`
    );

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">


      {/* HEADER */}

      <div className="flex items-start justify-between">

        <div className="flex items-start gap-4">

          <div className="p-3 bg-red-100 rounded-lg">

            <AlertTriangle
              size={26}
              className="text-red-600"
            />

          </div>


          <div>

            <p className="text-sm text-slate-500">
              Active Incident
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {incident.title}
            </h2>

          </div>

        </div>


        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${severityClass}`}
        >
          {severity}
        </span>

      </div>


      {/* DESCRIPTION */}

      <p className="text-sm text-slate-600 mt-5">
        {incident.description}
      </p>


      {/* DETAILS */}

      <div className="grid grid-cols-2 gap-4 mt-6">


        <div className="bg-slate-50 rounded-lg p-4">

          <p className="text-xs text-slate-500">
            Incident ID
          </p>

          <p className="font-semibold text-slate-900 mt-1">
            {incident.id}
          </p>

        </div>


        <div className="bg-slate-50 rounded-lg p-4">

          <p className="text-xs text-slate-500">
            Affected Payments
          </p>

          <p className="font-semibold text-red-600 mt-1">
            {incident.affectedPayments}
          </p>

        </div>

      </div>


      {/* BANK */}

      <div className="mt-5">

        <p className="text-xs text-slate-500">
          Bank
        </p>

        <p className="font-semibold text-slate-900 mt-1">
          {incident.bank || "Unknown"}
        </p>

      </div>


      {/* METHOD */}

      <div className="mt-4">

        <p className="text-xs text-slate-500">
          Payment Method
        </p>

        <p className="font-semibold text-slate-900 mt-1">
          {incident.method || "Unknown"}
        </p>

      </div>


      {/* INVESTIGATION */}

      <div className="border-t border-slate-200 mt-6 pt-5">

        <div className="flex items-center gap-2">

          <ShieldAlert
            size={19}
            className="text-red-600"
          />

          <span className="text-sm font-medium text-slate-700">
            Investigation required
          </span>

        </div>


        <button
          type="button"
          onClick={handleInvestigate}
          className="
            mt-4
            w-full
            flex
            items-center
            justify-center
            gap-2
            bg-purple-600
            hover:bg-purple-700
            text-white
            font-semibold
            py-3
            rounded-lg
            transition
            cursor-pointer
          "
        >

          <Brain size={19} />

          AI Investigate

        </button>

      </div>


      {/* FOOTER */}

      <p className="text-xs text-slate-400 mt-4">
        Detected automatically from payment
        failure patterns.
      </p>


    </div>

  );

}


export default IncidentCard;

