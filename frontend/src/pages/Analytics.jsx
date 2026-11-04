import {
  BarChart3,
  CheckCircle,
  XCircle,
  CreditCard,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import useAnalytics from "../hooks/useAnalytics";

function Analytics() {
  const {
    analytics,
    loading,
    error,
  } = useAnalytics();

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <Navbar />

        <main className="pt-18 lg:ml-72">
          <div className="p-8 text-center">

            <BarChart3
              size={50}
              className="mx-auto text-purple-600 animate-pulse"
            />

            <p className="mt-4 text-slate-500">
              Loading analytics...
            </p>

          </div>
        </main>
      </div>
    );
  }

  // -----------------------------
  // ERROR
  // -----------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <Navbar />

        <main className="pt-18 lg:ml-72">
          <div className="p-8">

            <div
              className="
                bg-red-50
                border
                border-red-200
                rounded-xl
                p-6
                text-red-600
              "
            >
              {error}
            </div>

          </div>
        </main>
      </div>
    );
  }

  // -----------------------------
  // NO DATA
  // -----------------------------

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <Navbar />

        <main className="pt-18 lg:ml-72">
          <div className="p-8 text-center text-slate-500">
            No analytics data available.
          </div>
        </main>
      </div>
    );
  }

  // -----------------------------
  // BACKEND DATA
  // -----------------------------

  const summary = analytics.summary || {};

  const totalPayments = summary.totalPayments || 0;

  const successfulPayments =
    summary.successfulPayments || 0;

  const failedPayments =
    summary.failedPayments || 0;

  // Backend currently returns failureRate.
  // We calculate successRate for the UI.

  const successRate =
    totalPayments > 0
      ? Number(
          (
            (successfulPayments / totalPayments) *
            100
          ).toFixed(2)
        )
      : 0;

  // Backend returns banks
  const failuresByBank =
    analytics.banks || [];

  // Backend returns methods
  const failuresByMethod =
    analytics.methods || [];

  // -----------------------------
  // PAYMENT STATUS PIE CHART
  // -----------------------------

  const paymentStatusData = [
    {
      name: "Success",
      value: successfulPayments,
    },
    {
      name: "Failed",
      value: failedPayments,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#ef4444",
  ];

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="min-h-screen bg-slate-50">

      {/* SIDEBAR */}

      <Sidebar />

      {/* NAVBAR */}

      <Navbar />

      {/* MAIN */}

      <main className="pt-18 lg:ml-72">

        <div className="p-8">

          {/* HEADER */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-slate-900">
              Payment Analytics
            </h1>

            <p className="text-slate-500 mt-2">
              Real-time insights from payment transaction data.
            </p>

          </div>

          {/* GEMINI AI ANALYTICS INTELLIGENCE */}
          {analytics.aiInsights && (
            <div className="mb-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-600 p-2.5 text-white shadow">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Gemini AI Analytics Intelligence
                    </h2>
                    <p className="text-xs text-slate-500">
                      Automated platform health analysis & revenue risk assessment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500">System Health:</span>
                  <div className="flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3.5 py-1 text-xs font-bold text-slate-800 shadow-sm">
                    <span className="text-indigo-600 font-extrabold">{analytics.aiInsights.healthScore}/100</span>
                    <span className="text-slate-300">•</span>
                    <span className={
                      analytics.aiInsights.healthStatus === "CRITICAL"
                        ? "text-rose-600"
                        : analytics.aiInsights.healthStatus === "DEGRADED"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }>
                      {analytics.aiInsights.healthStatus}
                    </span>
                  </div>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                    {analytics.aiInsights.analysisSource || "Google Gemini"}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-700 leading-relaxed font-medium">
                {analytics.aiInsights.executiveSummary}
              </p>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(analytics.aiInsights.keyObservations) && analytics.aiInsights.keyObservations.length > 0 && (
                  <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Key Observations & Bottlenecks
                    </p>
                    <ul className="space-y-1.5">
                      {analytics.aiInsights.keyObservations.map((obs, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{obs}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(analytics.aiInsights.actionableRecommendations) && analytics.aiInsights.actionableRecommendations.length > 0 && (
                  <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Optimization & Routing Actions
                    </p>
                    <ul className="space-y-1.5">
                      {analytics.aiInsights.actionableRecommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* STATS */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-4
              gap-6
              mb-8
            "
          >

            {/* TOTAL */}

            <div
              className="
                bg-white
                border
                rounded-xl
                p-6
              "
            >

              <div
                className="
                  flex
                  justify-between
                  items-center
                "
              >

                <div>

                  <p className="text-sm text-slate-500">
                    Total Payments
                  </p>

                  <h2
                    className="
                      text-3xl
                      font-bold
                      mt-2
                    "
                  >
                    {totalPayments}
                  </h2>

                </div>

                <CreditCard
                  size={30}
                  className="text-purple-600"
                />

              </div>

            </div>


            {/* SUCCESS */}

            <div
              className="
                bg-white
                border
                rounded-xl
                p-6
              "
            >

              <div
                className="
                  flex
                  justify-between
                  items-center
                "
              >

                <div>

                  <p className="text-sm text-slate-500">
                    Successful
                  </p>

                  <h2
                    className="
                      text-3xl
                      font-bold
                      mt-2
                      text-green-600
                    "
                  >
                    {successfulPayments}
                  </h2>

                </div>

                <CheckCircle
                  size={30}
                  className="text-green-600"
                />

              </div>

            </div>


            {/* FAILED */}

            <div
              className="
                bg-white
                border
                rounded-xl
                p-6
              "
            >

              <div
                className="
                  flex
                  justify-between
                  items-center
                "
              >

                <div>

                  <p className="text-sm text-slate-500">
                    Failed
                  </p>

                  <h2
                    className="
                      text-3xl
                      font-bold
                      mt-2
                      text-red-600
                    "
                  >
                    {failedPayments}
                  </h2>

                </div>

                <XCircle
                  size={30}
                  className="text-red-600"
                />

              </div>

            </div>


            {/* SUCCESS RATE */}

            <div
              className="
                bg-white
                border
                rounded-xl
                p-6
              "
            >

              <div
                className="
                  flex
                  justify-between
                  items-center
                "
              >

                <div>

                  <p className="text-sm text-slate-500">
                    Success Rate
                  </p>

                  <h2
                    className="
                      text-3xl
                      font-bold
                      mt-2
                      text-purple-600
                    "
                  >
                    {successRate}%
                  </h2>

                </div>

                <TrendingUp
                  size={30}
                  className="text-purple-600"
                />

              </div>

            </div>

          </div>


          {/* CHARTS */}

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-8
            "
          >

            {/* PAYMENT STATUS PIE CHART */}

            <div
              className="
                bg-white
                border
                rounded-xl
                p-6
              "
            >

              <h2
                className="
                  text-lg
                  font-bold
                  mb-6
                "
              >
                Payment Status Distribution
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label
                  >

                    {paymentStatusData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index]}
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>


            {/* FAILURE BY BANK */}

            <div
              className="
                bg-white
                border
                rounded-xl
                p-6
              "
            >

              <h2
                className="
                  text-lg
                  font-bold
                  mb-6
                "
              >
                Failures by Bank
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={failuresByBank}
                >

                  <XAxis dataKey="bank" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="failures"
                    fill="#8b5cf6"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>


            {/* FAILURE BY METHOD */}

            <div
              className="
                bg-white
                border
                rounded-xl
                p-6
                lg:col-span-2
              "
            >

              <h2
                className="
                  text-lg
                  font-bold
                  mb-6
                "
              >
                Failures by Payment Method
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={failuresByMethod}
                >

                  <XAxis dataKey="method" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="failures"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Analytics;
