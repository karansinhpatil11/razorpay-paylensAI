const express = require("express");

const router = express.Router();

const {
  predictPaymentRisk,
} = require("../controllers/riskController");

router.get("/test", (req, res) => {

  res.json({
    message: "Risk route working"
  });

});

router.get(
  "/:paymentId",
  predictPaymentRisk
);


module.exports = router;