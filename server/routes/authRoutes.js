const express = require("express");
const router = express.Router();

// Import controller functions
const { signup, login, getMe } = require("../controllers/authController");

// Import the auth middleware (to protect certain routes)
const protect = require("../middleware/authMiddleware");

// ========================
// Public Routes (no token needed)
// ========================

// Signup route - anyone can create an account
router.post("/signup", signup);

// Login route - anyone can log in
router.post("/login", login);

// ========================
// Protected Routes (token required)
// ========================

// Get current user - only logged-in users can access this
router.get("/me", protect, getMe);

module.exports = router;
