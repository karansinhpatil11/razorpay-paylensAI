function AnalyticsCards({ analytics }) {

  if (!analytics) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

      {/* TOTAL PAYMENTS */}

      <div className="bg-white border rounded-xl p-6 shadow-sm">

        <p className="text-sm text-gray-500">
          Total Payments
        </p>

        <p className="text-3xl font-bold mt-2">
          {analytics.totalPayments ?? 0}
        </p>

        <p className="text-xs text-gray-400 mt-2">
          Total transactions
        </p>

      </div>


      {/* SUCCESSFUL */}

      <div className="bg-white border rounded-xl p-6 shadow-sm">

        <p className="text-sm text-gray-500">
          Successful Payments
        </p>

        <p className="text-3xl font-bold text-green-600 mt-2">
          {analytics.successfulPayments ?? 0}
        </p>

        <p className="text-xs text-gray-400 mt-2">
          Successfully completed
        </p>

      </div>


      {/* FAILED */}

      <div className="bg-white border rounded-xl p-6 shadow-sm">

        <p className="text-sm text-gray-500">
          Failed Payments
        </p>

        <p className="text-3xl font-bold text-red-600 mt-2">
          {analytics.failedPayments ?? 0}
        </p>

        <p className="text-xs text-gray-400 mt-2">
          Failed transactions
        </p>

      </div>


      {/* FAILURE RATE */}

      <div className="bg-white border rounded-xl p-6 shadow-sm">

        <p className="text-sm text-gray-500">
          Failure Rate
        </p>

        <p className="text-3xl font-bold text-orange-600 mt-2">
          {analytics.failureRate ?? 0}%
        </p>

        <p className="text-xs text-gray-400 mt-2">
          Current payment failure rate
        </p>

      </div>

    </div>
  );
}

export default AnalyticsCards;