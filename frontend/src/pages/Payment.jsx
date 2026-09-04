import { useNavigate } from "react-router-dom";
import usePayments from "../hooks/usePayments";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Payments() {
  const navigate = useNavigate();

  const {
    payments,
    loading,
    error,
  } = usePayments();

  if (loading) {
    return <div className="min-h-screen bg-slate-50"><Sidebar /><Navbar /><main className="pt-18 lg:ml-72"><div className="p-8 text-slate-500">Loading payments...</div></main></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-slate-50"><Sidebar /><Navbar /><main className="pt-18 lg:ml-72"><div className="p-8 text-rose-600">{error}</div></main></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />
      <main className="pt-18 lg:ml-72">
      <div className="mx-auto max-w-[1400px] p-5 lg:p-8">

      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Transaction workspace</p>
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Payments
      </h1>
      <p className="mb-7 text-sm text-slate-500">Review every transaction and investigate failed payments.</p>

      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">

          <table className="w-full border-collapse text-sm">

            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="p-4">Payment ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Bank</th>
                <th className="p-4">Method</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/payments/${payment.paymentId}`)}
                      className="font-semibold text-slate-800 hover:text-indigo-600 hover:underline cursor-pointer"
                    >
                      {payment.paymentId}
                    </button>
                  </td>

                  <td className="p-3">
                    ₹{payment.amount}
                  </td>

                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${payment.status === "FAILED" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{payment.status}</span>
                  </td>

                  <td className="p-3">
                    {payment.bank || "-"}
                  </td>

                  <td className="p-3">
                    {payment.method || "-"}
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/payments/${payment.paymentId}`)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Details
                      </button>

                      {payment.status === "FAILED" && (
                        <button
                          onClick={() =>
                            navigate(
                              `/investigation/${payment.paymentId}`
                            )
                          }
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                        >
                          Investigate
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

      </div>
      </main>
    </div>
  );
}

export default Payments;
