const express = require("express");

const router = express.Router();

const {
  getIncidents,
} = require(
  "../controllers/incidentController"
);


router.get(
  "/",
  getIncidents
);


module.exports = router;