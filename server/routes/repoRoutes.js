const express = require("express");
const router = express.Router();

const { analyzeRepo, getFileContent } = require("../controllers/repoController");
const protect = require("../middleware/authMiddleware");


router.post("/analyze", protect, analyzeRepo);
router.post("/file-content", protect, getFileContent);

module.exports = router;
