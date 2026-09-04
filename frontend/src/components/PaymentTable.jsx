import { useNavigate } from "react-router-dom";

function PaymentTable({ payments = [] }) {
  const navigate = useNavigate();

  if (!Array.isArray(payments) || payments.length === 0) {
    return (
      <p className="text-gray-500">
        No payments found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">

        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
            <th className="p-3 text-left font-semibold">Payment ID</th>
            <th className="p-3 text-left font-semibold">Amount</th>
            <th className="p-3 text-left font-semibold">Status</th>
            <th className="p-3 text-left font-semibold">Bank</th>
            <th className="p-3 text-left font-semibold">Method</th>
            <th className="p-3 text-left font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment, index) => {
            const paymentKey =
              payment?._id ||
              payment?.paymentId ||
              `payment-${index}`;

            return (
              <tr
                key={paymentKey}
                className="border-b border-slate-100 transition hover:bg-slate-50/80"
              >

                <td className="p-3">
                  <span className="font-semibold text-slate-800">{payment?.paymentId || "-"}</span>
                </td>

                <td className="p-3">
                  ₹{payment?.amount ?? 0}
                </td>

                <td className="p-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${payment?.status === "FAILED" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{payment?.status || "-"}</span>
                </td>

                <td className="p-3">
                  {payment?.bank || "-"}
                </td>

                <td className="p-3">
                  {payment?.method || "-"}
                </td>

                <td className="p-3">
                  {payment?.status === "FAILED" ? (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/investigation/${payment.paymentId}`
                        )
                      }
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      Investigate
                    </button>
                  ) : (
                    <span className="text-gray-400">
                      -
                    </span>
                  )}
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}

export default PaymentTable;
