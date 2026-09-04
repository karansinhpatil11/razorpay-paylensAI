const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const aiRoutes = require("./src/routes/aiRoutes");
const riskRoutes = require("./src/routes/riskRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const investigationRoutes = require("./src/routes/investigationRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const incidentRoutes = require("./src/routes/incidentRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

dotenv.config();

const app = express();

// ===============================
// MongoDB
// ===============================

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => res.json({ success: true, message: "PayLens AI Backend is running" }));
app.get("/health", (req, res) => res.json({ success: true, database: "configured" }));

// ===============================
// API Routes
// ===============================

app.use("/api/payments", paymentRoutes);

app.use("/api/investigations", investigationRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/incidents", incidentRoutes);

app.use("/api/risk", riskRoutes);

app.use("/api/ai", aiRoutes);

// ===============================
// Error Handling
// ===============================

app.use(notFound);

app.use(errorHandler);

// ===============================
// Server
// ===============================

const PORT = Number(process.env.PORT) || 5000;
async function start() {
  await connectDB();
  app.listen(PORT, () => console.log(`PayLens backend listening on http://localhost:${PORT}`));
}
if (require.main === module) {
  start().catch((error) => { console.error("Unable to start backend:", error.message); process.exit(1); });
}
module.exports = { app, start };
