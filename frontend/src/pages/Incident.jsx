import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import IncidentCard from "../components/IncidentCard";
import useIncidents from "../hooks/useIncidents";

function Incidents() {
  const { incidents, aiReport, loading, error } = useIncidents();

  const platformHealth = aiReport?.platform_health || "HEALTHY";
  const healthBadgeClass =
    platformHealth === "CRITICAL"
      ? "bg-rose-100 text-rose-800 border-rose-300"
      : platformHealth === "DEGRADED"
      ? "bg-amber-100 text-amber-800 border-amber-300"
      : "bg-emerald-100 text-emerald-800 border-emerald-300";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="pt-18 lg:ml-72">
        <div className="p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Payment Incident Management
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Real-time systemic failure clusters analyzed with Google Gemini.
              </p>
            </div>

            {aiReport && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Platform Status:</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${healthBadgeClass}`}>
                  <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                  {platformHealth}
                </span>
              </div>
            )}
          </div>

          {/* GEMINI AI EXECUTIVE INCIDENT SUMMARY BANNER */}
          {aiReport && (
            <div className="mb-6 overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-slate-50 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-indigo-600 p-2.5 text-white shadow">
                  <Sparkles size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      Gemini AI Incident Assessment
                    </h2>
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
                      {aiReport.analysisSource || "Google Gemini"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                    {aiReport.incident_summary}
                  </p>

                  {Array.isArray(aiReport.action_items) && aiReport.action_items.length > 0 && (
                    <div className="mt-4 border-t border-indigo-100 pt-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Recommended Operational Actions:
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {aiReport.action_items.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {loading && <p className="text-slate-500">Loading incidents...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && incidents.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" />
              <p className="font-semibold text-slate-800">No active incidents detected</p>
              <p className="text-xs text-slate-500 mt-1">All payment rails and bank gateways are operating smoothly.</p>
            </div>
          )}
          {!loading && !error && incidents.length > 0 && (
            <div className="grid gap-5 lg:grid-cols-2">
              {incidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Incidents;
