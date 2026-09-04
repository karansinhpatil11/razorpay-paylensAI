const express = require("express");
const { investigate } = require("../controllers/aiController");

const router = express.Router();

router.post("/investigate", investigate);

module.exports = router;
