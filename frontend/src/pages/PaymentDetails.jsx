import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPaymentById } from "../services/paymentService";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function PaymentDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadPayment = async () => {

      try {

        const response =
          await getPaymentById(id);

        console.log(
          "Payment details:",
          response
        );

        setPayment(response);

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.message ||
          "Failed to load payment"
        );

      } finally {

        setLoading(false);

      }
    };

    loadPayment();

  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50"><Sidebar /><Navbar /><main className="pt-18 lg:ml-72"><div className="p-8 text-slate-500">Loading payment...</div></main></div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50"><Sidebar /><Navbar /><main className="pt-18 lg:ml-72"><div className="p-8 text-rose-600">{error}</div></main></div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-slate-50"><Sidebar /><Navbar /><main className="pt-18 lg:ml-72"><div className="p-8 text-slate-500">Payment not found.</div></main></div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />
      <main className="pt-18 lg:ml-72">
      <div className="mx-auto max-w-5xl p-5 lg:p-8">

      <button
        onClick={() => navigate("/payments")}
        className="mb-7 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-indigo-200 hover:text-indigo-700"
      >
        ← Back to Payments
      </button>

      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Payment Details
      </h1>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500">
              Payment ID
            </p>

            <p className="font-semibold">
              {payment.paymentId}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Amount
            </p>

            <p className="font-semibold">
              ₹{payment.amount}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Status
            </p>

            <p className="font-semibold">
              {payment.status}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Payment Method
            </p>

            <p className="font-semibold">
              {payment.method || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Created At
            </p>

            <p className="font-semibold">
              {payment.createdAt
                ? new Date(
                    payment.createdAt
                  ).toLocaleString()
                : "N/A"}
            </p>
          </div>

        </div>

      </div>

      </div>
      </main>
    </div>
  );
}

export default PaymentDetails;
