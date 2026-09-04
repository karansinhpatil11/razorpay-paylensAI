import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import IncidentCard from "../components/IncidentCard";
import useIncidents from "../hooks/useIncidents";

function Incidents() {
  const { incidents, loading, error } = useIncidents();
  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />
      <Navbar />

      <main className="pt-18 lg:ml-72">

        <div className="p-8">

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Incidents
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Payment incidents detected by PayLens AI.
            </p>
          </div>

          {loading && <p className="text-slate-500">Loading incidents...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && incidents.length === 0 && <p className="text-slate-500">No active incidents detected.</p>}
          {!loading && !error && <div className="grid gap-5 lg:grid-cols-2">

            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
              />
            ))}

          </div>}

        </div>

      </main>

    </div>
  );
}

export default Incidents;
