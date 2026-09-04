import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import { investigatePayment } from "../services/investigationService";

import {
  ArrowLeft,
  Brain,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function InvestigationDetails() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // AI INVESTIGATION
  // ==========================================

  const handleInvestigation = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      console.log("Starting AI investigation:", paymentId);

      const data = await investigatePayment(paymentId);

      console.log("AI RESULT:", data);

      /*
       * Your API returns:
       *
       * {
       *   paymentId: "PAY1003",
       *   riskScore: 20,
       *   riskLevel: "LOW",
       *   reasons: [
       *     "No significant fraud indicators detected"
       *   ],
       *   recommendation: "Transaction appears normal."
       * }
       */

      setResult({
        paymentId: data?.paymentId || paymentId,

        riskScore: data?.riskScore ?? 0,

        riskLevel: data?.riskLevel || "UNKNOWN",

        root_cause:
          data?.root_cause ||
          data?.rootCause ||
          data?.reasons?.[0] ||
          "No significant fraud indicators detected",

        confidence: data?.confidence ?? data?.riskScore ?? 0,

        evidence: Array.isArray(data?.evidence)
          ? data.evidence
          : Array.isArray(data?.reasons)
          ? data.reasons
          : [],

        recommendation:
          data?.recommendation ||
          "No recommendation available.",
      });

    } catch (err) {
      console.error("AI investigation error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "AI investigation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <Sidebar />

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <main className="pt-18 lg:ml-72">

        <div className="p-8 max-w-5xl">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/incidents")}
            className="
              flex
              items-center
              gap-2
              text-slate-600
              hover:text-purple-600
              mb-6
            "
          >
            <ArrowLeft size={18} />
            Back to Incidents
          </button>

          {/* HEADER */}
          <div className="mb-8">

            <div className="flex items-center gap-4">

              <div className="p-3 bg-purple-100 rounded-xl">

                <Brain
                  size={30}
                  className="text-purple-600"
                />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  AI Payment Investigation
                </h1>

                <p className="text-slate-500 mt-1">
                  Investigating payment:{" "}
                  <span className="font-semibold text-slate-700">
                    {paymentId}
                  </span>
                </p>

              </div>

            </div>

          </div>

          {/* INITIAL STATE */}
          {!result && !loading && !error && (
            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-xl
                p-10
                shadow-sm
                text-center
              "
            >

              <Brain
                size={55}
                className="mx-auto text-purple-600"
              />

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-900
                  mt-5
                "
              >
                Ready to Investigate
              </h2>

              <p className="text-slate-500 mt-2">
                AI will analyze the payment,
                failure reason and transaction
                patterns.
              </p>

              <button
                onClick={handleInvestigation}
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  px-6
                  py-3
                  bg-purple-600
                  hover:bg-purple-700
                  text-white
                  font-semibold
                  rounded-lg
                  transition
                "
              >
                <Brain size={20} />
                Start AI Investigation
              </button>

            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div
              className="
                bg-white
                border
                rounded-xl
                p-10
                text-center
              "
            >

              <Brain
                size={55}
                className="
                  mx-auto
                  text-purple-600
                  animate-pulse
                "
              />

              <h2 className="text-xl font-bold mt-5">
                AI is Investigating...
              </h2>

              <p className="text-slate-500 mt-2">
                Analyzing payment failure
                patterns and transaction data.
              </p>

            </div>
          )}

          {/* ERROR */}
          {error && (
            <div
              className="
                bg-red-50
                border
                border-red-200
                rounded-xl
                p-6
              "
            >

              <div className="flex items-start gap-3">

                <AlertTriangle
                  className="text-red-600"
                />

                <div>

                  <h2 className="font-bold text-red-700">
                    Investigation Failed
                  </h2>

                  <p className="text-red-600 mt-2">
                    {error}
                  </p>

                  <button
                    onClick={handleInvestigation}
                    className="
                      mt-4
                      px-5
                      py-2
                      bg-red-600
                      text-white
                      rounded-lg
                    "
                  >
                    Try Again
                  </button>

                </div>

              </div>

            </div>
          )}

          {/* RESULT */}
          {result && (
            <div className="space-y-6">

              {/* RISK SUMMARY */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* PAYMENT ID */}
                <div className="bg-white border rounded-xl p-6 shadow-sm">

                  <p className="text-sm text-slate-500">
                    Payment ID
                  </p>

                  <h2 className="text-xl font-bold mt-2">
                    {result.paymentId}
                  </h2>

                </div>

                {/* RISK SCORE */}
                <div className="bg-white border rounded-xl p-6 shadow-sm">

                  <p className="text-sm text-slate-500">
                    Risk Score
                  </p>

                  <h2 className="text-4xl font-bold text-purple-600 mt-2">
                    {result.riskScore}%
                  </h2>

                </div>

                {/* RISK LEVEL */}
                <div className="bg-white border rounded-xl p-6 shadow-sm">

                  <p className="text-sm text-slate-500">
                    Risk Level
                  </p>

                  <div className="flex items-center gap-2 mt-3">

                    {result.riskLevel === "HIGH" ? (
                      <AlertTriangle
                        className="text-red-600"
                      />
                    ) : result.riskLevel === "MEDIUM" ? (
                      <AlertTriangle
                        className="text-yellow-600"
                      />
                    ) : (
                      <CheckCircle
                        className="text-green-600"
                      />
                    )}

                    <span className="text-xl font-bold">
                      {result.riskLevel}
                    </span>

                  </div>

                </div>

              </div>

              {/* ROOT CAUSE */}
              <div
                className="
                  bg-white
                  border
                  rounded-xl
                  p-6
                  shadow-sm
                "
              >

                <div className="flex items-center gap-3">

                  <AlertTriangle
                    className="text-orange-500"
                  />

                  <div>

                    <p className="text-sm text-slate-500">
                      AI Detected Root Cause
                    </p>

                    <h2
                      className="
                        text-2xl
                        font-bold
                        text-slate-900
                        mt-1
                      "
                    >
                      {result.root_cause}
                    </h2>

                  </div>

                </div>

              </div>

              {/* CONFIDENCE */}
              <div
                className="
                  bg-white
                  border
                  rounded-xl
                  p-6
                  shadow-sm
                "
              >

                <p className="text-sm text-slate-500">
                  AI Confidence
                </p>

                <p
                  className="
                    text-4xl
                    font-bold
                    text-purple-600
                    mt-2
                  "
                >
                  {result.confidence}%
                </p>

              </div>

              {/* EVIDENCE */}
              <div
                className="
                  bg-white
                  border
                  rounded-xl
                  p-6
                  shadow-sm
                "
              >

                <h2 className="text-xl font-bold">
                  Evidence
                </h2>

                {result.evidence?.length > 0 ? (

                  <div className="mt-4 space-y-3">

                    {result.evidence.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="
                            flex
                            items-start
                            gap-3
                            bg-slate-50
                            p-4
                            rounded-lg
                          "
                        >

                          <CheckCircle
                            size={20}
                            className="
                              text-green-600
                              mt-0.5
                            "
                          />

                          <p className="text-slate-700">
                            {item}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-slate-500 mt-3">
                    No evidence available.
                  </p>

                )}

              </div>

              {/* RECOMMENDATION */}
              <div
                className="
                  bg-purple-50
                  border
                  border-purple-200
                  rounded-xl
                  p-6
                "
              >

                <h2
                  className="
                    text-xl
                    font-bold
                    text-purple-900
                  "
                >
                  Recommended Action
                </h2>

                <p className="text-purple-800 mt-3">
                  {result.recommendation}
                </p>

              </div>

              {/* RUN AGAIN */}
              <button
                onClick={handleInvestigation}
                className="
                  px-5
                  py-3
                  bg-purple-600
                  text-white
                  rounded-lg
                  font-semibold
                  hover:bg-purple-700
                "
              >
                Run Investigation Again
              </button>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default InvestigationDetails;
