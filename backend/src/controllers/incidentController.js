const Payment = require("../models/Payment");
const { analyzeIncidents } = require("../services/aiService");

// ==========================================
// GET ACTIVE INCIDENTS WITH GEMINI AI ANALYSIS
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
      const bank = payment.bank || "Unknown";
      const method = payment.method || "Unknown";
      const key = `${bank}-${method}`;

      if (!incidentMap[key]) {
        incidentMap[key] = {
          payments: [],
          bank,
          method,
        };
      }

      incidentMap[key].payments.push(payment);
    });

    // Convert groups into incidents
    const incidents = Object.entries(incidentMap)
      .filter(([, incident]) => incident.payments.length >= 2)
      .map(([key, incident], index) => {
        const affectedPayments = incident.payments.length;

        // Default severity logic
        let severity = "LOW";
        if (affectedPayments >= 5) {
          severity = "HIGH";
        } else if (affectedPayments >= 3) {
          severity = "MEDIUM";
        }

        return {
          id: `INC-${String(index + 1).padStart(3, "0")}`,
          title: `${incident.bank} ${incident.method} Failure Spike`,
          description: `${affectedPayments} failed ${incident.method} payment(s) detected for ${incident.bank}.`,
          severity,
          affectedPayments,
          bank: incident.bank,
          method: incident.method,
          payments: incident.payments,
        };
      });

    // Enrich incidents with Gemini AI Incident Report
    let aiReport = null;
    if (incidents.length > 0) {
      aiReport = await analyzeIncidents(incidents, failedPayments.slice(0, 25));
      if (aiReport && Array.isArray(aiReport.incidents)) {
        const aiIncidentMap = new Map(aiReport.incidents.map((i) => [i.id, i]));
        incidents.forEach((inc) => {
          const aiData = aiIncidentMap.get(inc.id);
          if (aiData) {
            inc.root_cause_hypothesis = aiData.root_cause_hypothesis;
            inc.blast_radius = aiData.blast_radius;
            inc.mitigation_step = aiData.mitigation_step;
            if (aiData.severity) inc.severity = aiData.severity;
          }
        });
      }
    }

    res.status(200).json({
      incidents,
      total: incidents.length,
      aiReport,
    });
  } catch (error) {
    console.error("Incident detection error:", error);

    res.status(500).json({
      message: "Failed to generate incidents",
      error: error.message,
    });
  }
};

module.exports = {
  getIncidents,
};
