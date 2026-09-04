import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function BankFailureChart({ data = [] }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">

      <h2 className="text-xl font-bold mb-5">
        Bank Failure Analysis
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500">
          No bank failure data available.
        </p>
      ) : (
        <div className="w-full h-80">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={data}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="bank" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="failures"
                name="Failures"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>
      )}

    </div>
  );
}

export default BankFailureChart;