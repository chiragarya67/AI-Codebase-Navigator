const express = require("express");
const router = express.Router();

const { explain, question } = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

router.post("/explain", protect, explain);
router.post("/question", protect, question);

module.exports = router;
