const express = require("express");

const router = express.Router();

const {
  investigatePayment,
  getInvestigations,
  getInvestigationById,
} = require("../controllers/investigationController");


// ==========================================
// INVESTIGATE PAYMENT
// ==========================================

router.post(
  "/:paymentId",
  investigatePayment
);


// ==========================================
// GET ALL INVESTIGATIONS
// ==========================================

router.get(
  "/",
  getInvestigations
);

router.get("/:paymentId", getInvestigationById);


module.exports = router;
