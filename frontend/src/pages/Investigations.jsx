import { useState } from "react";

import {
  Brain,
  Eye,
  RefreshCw,
  AlertTriangle,
  Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import useInvestigations from "../hooks/useInvestigation";


function Investigations() {

  const navigate = useNavigate();

  const {
    investigations,
    loading,
    error,
    reload,
  } = useInvestigations();

  const [search, setSearch] = useState("");


  // SEARCH
  const filteredInvestigations =
    investigations.filter((investigation) => {

      const value = search.toLowerCase().trim();

      if (!value) return true;

      return (
        investigation.paymentId
          ?.toLowerCase()
          .includes(value) ||

        investigation.rootCause
          ?.toLowerCase()
          .includes(value) ||

        investigation.root_cause
          ?.toLowerCase()
          .includes(value) ||

        investigation.recommendation
          ?.toLowerCase()
          .includes(value) ||

        investigation.riskLevel
          ?.toLowerCase()
          .includes(value)
      );
    });


  return (

    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <Navbar />


      <main className="pt-18 lg:ml-72">

        <div className="p-8">


          {/* HEADER */}

          <div className="flex items-center justify-between mb-6">

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                AI Investigations
              </h1>

              <p className="text-slate-500 mt-2">
                History of AI payment investigations.
              </p>

            </div>


            <button
              onClick={reload}
              className="
                flex items-center gap-2
                px-4 py-2
                border border-slate-300
                rounded-lg
                bg-white
                hover:bg-slate-100
              "
            >

              <RefreshCw size={18} />

              Refresh

            </button>

          </div>


          {/* SEARCH */}

          <div className="mb-8">

            <div className="
              relative
              max-w-md
            ">

              <Search
                size={19}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search payment, risk, root cause..."
                className="
                  w-full
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  py-3
                  pl-10
                  pr-4
                  text-sm
                  outline-none
                  focus:border-purple-400
                "
              />

            </div>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="bg-white border rounded-xl p-10 text-center">

              <Brain
                size={45}
                className="
                  mx-auto
                  text-purple-600
                  animate-pulse
                "
              />

              <p className="mt-4 text-slate-500">
                Loading investigations...
              </p>

            </div>

          )}


          {/* ERROR */}

          {!loading && error && (

            <div className="
              bg-red-50
              border border-red-200
              rounded-xl
              p-6
            ">

              <div className="flex items-center gap-3">

                <AlertTriangle
                  className="text-red-600"
                />

                <div>

                  <h2 className="font-bold text-red-700">
                    Failed to load investigations
                  </h2>

                  <p className="text-red-600 mt-1">
                    {error}
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* NO SEARCH RESULTS */}

          {!loading &&
            !error &&
            investigations.length > 0 &&
            filteredInvestigations.length === 0 && (

              <div className="
                bg-white
                border
                rounded-xl
                p-12
                text-center
              ">

                <Search
                  size={50}
                  className="
                    mx-auto
                    text-slate-400
                  "
                />

                <h2 className="text-xl font-bold mt-5">
                  No Results Found
                </h2>

                <p className="text-slate-500 mt-2">
                  No investigation matches "{search}".
                </p>

              </div>

            )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            investigations.length === 0 && (

              <div className="
                bg-white
                border
                rounded-xl
                p-12
                text-center
              ">

                <Brain
                  size={50}
                  className="mx-auto text-slate-400"
                />

                <h2 className="text-xl font-bold mt-5">
                  No Investigations Yet
                </h2>

                <p className="text-slate-500 mt-2">
                  Investigate a failed payment to see
                  results here.
                </p>

              </div>

            )}


          {/* INVESTIGATIONS */}

          {!loading &&
            !error &&
            filteredInvestigations.length > 0 && (

              <div className="
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-6
              ">

                {filteredInvestigations.map(
                  (investigation) => (

                    <div
                      key={investigation._id}
                      className="
                        bg-white
                        border border-slate-200
                        rounded-xl
                        p-6
                        shadow-sm
                      "
                    >

                      {/* HEADER */}

                      <div className="
                        flex
                        justify-between
                        items-start
                      ">

                        <div className="flex gap-3">

                          <div className="
                            p-3
                            bg-purple-100
                            rounded-lg
                          ">

                            <Brain
                              size={24}
                              className="text-purple-600"
                            />

                          </div>


                          <div>

                            <p className="text-sm text-slate-500">
                              Payment Investigation
                            </p>

                            <h2 className="
                              text-xl
                              font-bold
                              text-slate-900
                              mt-1
                            ">
                              {investigation.paymentId}
                            </h2>

                          </div>

                        </div>


                        <span className="
                          bg-purple-100
                          text-purple-700
                          px-3 py-1
                          rounded-full
                          text-sm
                          font-bold
                        ">

                          {investigation.confidence ??
                            investigation.riskScore ??
                            0}%

                        </span>

                      </div>


                      {/* ROOT CAUSE */}

                      <div className="mt-6">

                        <p className="text-sm text-slate-500">
                          Root Cause
                        </p>

                        <p className="
                          font-semibold
                          text-slate-900
                          mt-1
                        ">

                          {investigation.rootCause ||
                            investigation.root_cause ||
                            investigation.reasons?.[0] ||
                            "Not detected"}

                        </p>

                      </div>


                      {/* RECOMMENDATION */}

                      <div className="
                        mt-5
                        bg-slate-50
                        rounded-lg
                        p-4
                      ">

                        <p className="text-xs text-slate-500">
                          Recommended Action
                        </p>

                        <p className="
                          text-sm
                          text-slate-700
                          mt-2
                        ">

                          {investigation.recommendation ||
                            "No recommendation available."}

                        </p>

                      </div>


                      {/* DATE + BUTTON */}

                      <div className="
                        mt-6
                        pt-5
                        border-t
                        flex
                        items-center
                        justify-between
                      ">

                        <p className="text-xs text-slate-400">

                          {investigation.createdAt
                            ? new Date(
                                investigation.createdAt
                              ).toLocaleString()
                            : "Date unavailable"}

                        </p>


                        <button
                          onClick={() =>
                            navigate(
                              `/investigation/${investigation.paymentId}`
                            )
                          }
                          className="
                            flex
                            items-center
                            gap-2
                            text-purple-600
                            hover:text-purple-800
                            font-semibold
                          "
                        >

                          <Eye size={18} />

                          View

                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </div>

      </main>

    </div>

  );
}


export default Investigations;
