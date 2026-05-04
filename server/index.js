const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "AI Codebase Navigator server is running!",
    timestamp: new Date().toISOString(),
  });
});

const authRoutes = require("./routes/authRoutes");
const repoRoutes = require("./routes/repoRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/repo", repoRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  });
});
