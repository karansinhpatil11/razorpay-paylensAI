const mongoose = require("mongoose");

/**
 * Publishes database changes to connected dashboards.
 * MongoDB change streams require Atlas or a replica set. If unavailable, the
 * REST API remains fully functional and this feature simply stays inactive.
 */
const startPaymentStream = (io) => {
  const payments = mongoose.connection.collection("payments");

  try {
    const stream = payments.watch([], { fullDocument: "updateLookup" });

    stream.on("change", (change) => {
      io.emit("payment:changed", {
        operation: change.operationType,
        payment: change.fullDocument || null,
        paymentId: change.documentKey?._id?.toString(),
      });
    });

    stream.on("error", (error) => {
      console.warn("Real-time payment stream unavailable:", error.message);
      stream.close().catch(() => {});
    });

    console.log("Real-time MongoDB payment stream connected");
  } catch (error) {
    console.warn("Real-time payment stream could not start:", error.message);
  }
};

module.exports = { startPaymentStream };
