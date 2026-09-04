const Payment = require("../models/Payment");


// ==========================================
// GET ACTIVE INCIDENTS
// ==========================================

const getIncidents = async (req, res) => {

  try {

    // Get all failed payments
    const failedPayments = await Payment.find({
      status: "FAILED",
    }).sort({
      timestamp: -1,
    });


    // Group failed payments by Bank + Method
    const incidentMap = {};


    failedPayments.forEach((payment) => {

      const bank =
        payment.bank || "Unknown";

      const method =
        payment.method || "Unknown";


      const key =
        `${bank}-${method}`;


      if (!incidentMap[key]) {

        incidentMap[key] = {

          payments: [],

          bank,

          method,

        };

      }


      incidentMap[key].payments.push(
        payment
      );

    });


    // Convert groups into incidents
    const incidents = Object.entries(
      incidentMap
    )
      .filter(
        ([, incident]) =>
          incident.payments.length >= 2
      )
      .map(
        ([key, incident], index) => {

          const affectedPayments =
            incident.payments.length;


          // Severity logic
          let severity = "LOW";

          if (affectedPayments >= 5) {

            severity = "HIGH";

          } else if (affectedPayments >= 3) {

            severity = "MEDIUM";

          }


          return {

            id:
              `INC-${String(index + 1).padStart(3, "0")}`,

            title:
              `${incident.bank} ${incident.method} Failure Spike`,

            description:
              `${affectedPayments} failed ${incident.method} payment(s) detected for ${incident.bank}.`,

            severity,

            affectedPayments,

            bank:
              incident.bank,

            method:
              incident.method,

            payments:
              incident.payments,

          };

        }
      );


    res.status(200).json({

      incidents,

      total:
        incidents.length,

    });

  } catch (error) {

    console.error(
      "Incident detection error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to generate incidents",

      error:
        error.message,

    });

  }

};


module.exports = {
  getIncidents,
};
