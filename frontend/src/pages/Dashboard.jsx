
import {
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import usePayments from "../hooks/usePayments";
import useAnalytics from "../hooks/useAnalytics";
import useIncidents from "../hooks/useIncidents";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import PaymentTable from "../components/PaymentTable";
import IncidentCard from "../components/IncidentCard";
import AnalyticsCards from "../components/AnalyticsCards";
import BankFailureChart from "../components/BankFailureChart";
import MethodFailureChart from "../components/MethodFailureChart";


function Dashboard() {

  // =====================================================
  // PAYMENTS
  // =====================================================

  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
  } = usePayments();


  // =====================================================
  // ANALYTICS
  // =====================================================

  const {
    analytics,
    loading: analyticsLoading,
    error: analyticsError,
  } = useAnalytics();


  // =====================================================
  // SAFE PAYMENT ARRAY
  // =====================================================

  const paymentList = Array.isArray(payments)
    ? payments
    : [];


  // =====================================================
  // GENERATE INCIDENTS
  // =====================================================

  const {
    incidents,
    activeIncidents,
  } = useIncidents(paymentList);


  // =====================================================
  // PAYMENT COUNTS
  // =====================================================

  const totalPayments = paymentList.length;

  const successfulPayments = paymentList.filter(
    (payment) =>
      String(payment?.status || "").toUpperCase() ===
      "SUCCESS"
  ).length;

  const failedPayments = paymentList.filter(
    (payment) =>
      String(payment?.status || "").toUpperCase() ===
      "FAILED"
  ).length;


  // =====================================================
  // SUCCESS RATE
  // =====================================================

  const successRate =
    totalPayments > 0
      ? (
          (successfulPayments / totalPayments) *
          100
        ).toFixed(1)
      : "0.0";


  // =====================================================
  // DEBUG
  // =====================================================

  console.log("PAYMENTS:", paymentList);
  console.log("INCIDENTS:", incidents);


  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* SIDEBAR */}

      <Sidebar />


      {/* NAVBAR */}

      <Navbar />


      {/* MAIN */}

      <main className="pt-18 lg:ml-72">

        <div className="mx-auto max-w-[1600px] p-5 lg:p-8">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />LIVE OPERATIONS</div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Payment Operations Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor payment health and investigate
              failures using AI.
            </p>

          </div>


          {/* =================================================
              PAYMENT ERROR
          ================================================= */}

          {paymentsError && (

            <div className="mb-6 bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg">

              <p className="font-semibold">
                Payment Error
              </p>

              <p>
                {paymentsError}
              </p>

            </div>

          )}


          {/* =================================================
              STAT CARDS
          ================================================= */}

          {paymentsLoading ? (

            <div className="bg-white border rounded-xl p-6">

              <p className="text-gray-500">
                Loading payments...
              </p>

            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Total Payments"
                value={totalPayments}
                description="Payments in database"
                trend="Live"
                icon={CreditCard}
                trendType="up"
              />

              <StatCard
                title="Successful Payments"
                value={successfulPayments}
                description="Success rate"
                trend={`${successRate}%`}
                icon={CheckCircle}
                trendType="up"
              />

              <StatCard
                title="Failed Payments"
                value={failedPayments}
                description="Requires investigation"
                trend={
                  failedPayments > 0
                    ? "Attention"
                    : "None"
                }
                icon={XCircle}
                trendType={
                  failedPayments > 0
                    ? "down"
                    : "up"
                }
              />

              <StatCard
                title="Active Incidents"
                value={activeIncidents}
                description={
                  activeIncidents > 0
                    ? "Based on failed payment patterns"
                    : "No active incidents"
                }
                trend={
                  activeIncidents > 0
                    ? "Attention"
                    : "None"
                }
                icon={AlertTriangle}
                trendType={
                  activeIncidents > 0
                    ? "down"
                    : "up"
                }
              />

            </div>

          )}


          {/* =================================================
              ACTIVE INCIDENTS
          ================================================= */}

          <div className="mt-8">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Active Incidents
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Automatically detected from payment
                  failure patterns.
                </p>

              </div>

              <div className="text-sm font-semibold text-slate-600">
                {activeIncidents} active
              </div>

            </div>


            {/* =================================================
                NO INCIDENTS
            ================================================= */}

            {incidents.length === 0 && (

              <div className="bg-white border border-slate-200 rounded-xl p-8">

                <div className="flex items-center gap-3">

                  <CheckCircle
                    size={24}
                    className="text-green-600"
                  />

                  <div>

                    <p className="font-semibold text-slate-900">
                      No Active Incidents
                    </p>

                    <p className="text-sm text-slate-500">
                      No significant payment failure
                      pattern has been detected.
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* =================================================
                INCIDENT GRID
            ================================================= */}

            {incidents.length > 0 && (

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {incidents.map((incident) => (

                  <IncidentCard
                    key={incident.id}
                    incident={incident}
                  />

                ))}

              </div>

            )}

          </div>


          {/* =================================================
              ANALYTICS
          ================================================= */}

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-5 text-slate-900">
              Payment Analytics
            </h2>


            {analyticsLoading && (

              <div className="bg-white border rounded-xl p-6">

                <p className="text-gray-500">
                  Loading analytics...
                </p>

              </div>

            )}


            {analyticsError && (

              <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg">

                <p className="font-semibold">
                  Analytics Error
                </p>

                <p>
                  {analyticsError}
                </p>

              </div>

            )}


            {!analyticsLoading &&
              !analyticsError &&
              analytics && (

                <>

                  <AnalyticsCards
                    analytics={analytics}
                  />


                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

                    <BankFailureChart
                      data={
                        analytics.banks || []
                      }
                    />

                    <MethodFailureChart
                      data={
                        analytics.methods || []
                      }
                    />

                  </div>


                  {/* TOP FAILING BANK */}

                  {analytics.banks?.[0] && (

                    <div className="bg-white border rounded-xl p-6 mt-8 shadow-sm">

                      <h2 className="text-xl font-bold mb-4">
                        Highest Bank Failure
                      </h2>

                      <p className="text-sm text-gray-500">
                        Bank
                      </p>

                      <p className="text-2xl font-bold text-slate-900">
                        {
                          analytics.banks[0].bank
                        }
                      </p>

                      <p className="text-sm text-gray-500 mt-3">
                        Failed Payments
                      </p>

                      <p className="text-xl font-semibold text-red-600">
                        {
                          analytics.banks[0].failures
                        }
                      </p>

                    </div>

                  )}


                  {/* TOP FAILING METHOD */}

                  {analytics.methods?.[0] && (

                    <div className="bg-white border rounded-xl p-6 mt-6 shadow-sm">

                      <h2 className="text-xl font-bold mb-4">
                        Highest Failing Payment Method
                      </h2>

                      <p className="text-sm text-gray-500">
                        Payment Method
                      </p>

                      <p className="text-2xl font-bold text-slate-900">
                        {
                          analytics.methods[0].method
                        }
                      </p>

                      <p className="text-sm text-gray-500 mt-3">
                        Failed Payments
                      </p>

                      <p className="text-xl font-semibold text-red-600">
                        {
                          analytics.methods[0].failures
                        }
                      </p>

                    </div>

                  )}

                </>

              )}

          </div>


          {/* =================================================
              RECENT PAYMENTS
          ================================================= */}

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-5 text-slate-900">
              Recent Payments
            </h2>

            <div className="bg-white rounded-xl border shadow-sm p-5">

              {paymentsLoading ? (

                <p className="text-gray-500">
                  Loading payments...
                </p>

              ) : (

                <PaymentTable
                  payments={paymentList}
                />

              )}

            </div>

          </div>


        </div>

      </main>

    </div>
  );
}


export default Dashboard;

