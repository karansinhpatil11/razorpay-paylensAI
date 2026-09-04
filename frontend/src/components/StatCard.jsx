import { TrendingUp, TrendingDown } from "lucide-react";

function StatCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  trendType = "up",
}) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">

      {/* TOP */}

      <div className="flex items-center justify-between">

        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        {Icon && (
          <div className="rounded-xl bg-indigo-50 p-2.5">
            <Icon
              size={20}
              className="text-indigo-600"
            />
          </div>
        )}

      </div>


      {/* VALUE */}

      <div className="mt-4">

        <h2 className="text-3xl font-bold text-slate-900">
          {value}
        </h2>

      </div>


      {/* DESCRIPTION + TREND */}

      <div className="flex items-center justify-between mt-3">

        <p className="text-xs text-slate-500">
          {description}
        </p>


        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              trendType === "up"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >

            {trendType === "up" ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}

            {trend}

          </div>
        )}

      </div>

    </div>
  );
}

export default StatCard;
