require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const resumeRoutes = require("./routes/resume");
const quizRoutes = require("./routes/quiz");
//const profileRoutes = require("./routes/profile"); // removed .js for consistency
const authRoutes = require("./routes/auth");
const achievementsRoutes = require("./routes/achievements");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for JSON requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // ✅ handles form submissions
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// Routes
app.use("/api/resume", resumeRoutes);
app.use("/api/quiz", quizRoutes);
//app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/achievements", achievementsRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));