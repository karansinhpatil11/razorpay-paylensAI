import {
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

function InvestigationResult({ investigation }) {
  if (!investigation) {
    return null;
  }

  return (
    <div className="space-y-5">

      {/* Root Cause */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-red-50 p-3 text-red-600">
            <AlertTriangle size={22} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              AI Detected Root Cause
            </p>

            <h2 className="text-xl font-bold text-slate-900">
              {investigation.rootCause}
            </h2>
          </div>

        </div>

        <div className="mt-5">

          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-500">
              AI Confidence
            </span>

            <span className="font-semibold">
              {investigation.confidence}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-900"
              style={{
                width: `${investigation.confidence}%`,
              }}
            />
          </div>

        </div>

      </div>

      {/* Evidence */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h3 className="font-semibold text-slate-900">
          Evidence
        </h3>

        <div className="mt-4 space-y-3">

          {investigation.evidence.map((item, index) => (

            <div
              key={index}
              className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
            >
              <CheckCircle
                size={18}
                className="mt-0.5 text-green-600"
              />

              <p className="text-sm text-slate-700">
                {item}
              </p>
            </div>

          ))}

        </div>

      </div>

      {/* Recommendation */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <ShieldAlert
            size={22}
            className="text-slate-700"
          />

          <h3 className="font-semibold text-slate-900">
            Recommended Action
          </h3>

        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {investigation.recommendation}
        </p>

      </div>

    </div>
  );
}

export default InvestigationResult;