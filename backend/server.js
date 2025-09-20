require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const resumeRoutes = require("./routes/resume");
const quizRoutes = require("./routes/quiz");
const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const achievementsRoutes = require("./routes/achievements");
const leaderboardRoutes = require("./routes/leaderboard");
const searchRoutes = require("./routes/search");
const opportunitiesRoutes = require("./routes/opportunities");
const recQuizRoutes = require("./routes/rec.quiz");
const studentRoutes = require("./routes/students");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/resume", resumeRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/home", homeRoutes);
app.use("/api", searchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/opportunities", opportunitiesRoutes);
app.use("/api", recQuizRoutes);
app.use("/api/students", studentRoutes);

// ✅ Serve frontend build (from Vite)
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Use Cloud Run's PORT, fallback to 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


// //backend/server.js
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const bodyParser = require("body-parser");
// const resumeRoutes = require("./routes/resume");
// const quizRoutes = require("./routes/quiz");
// const homeRoutes = require("./routes/home");
// //const profileRoutes = require("./routes/profile"); // removed .js for consistency
// const authRoutes = require("./routes/auth");
// const achievementsRoutes = require("./routes/achievements");
// const leaderboardRoutes=require("./routes/leaderboard");
// const searchRoutes = require("./routes/search");
// const opportunitiesRoutes = require("./routes/opportunities");
// const recQuizRoutes = require("./routes/rec.quiz");
// const studentRoutes = require("./routes/students");
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json()); // for JSON requests
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true })); // ✅ handles form submissions
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// // Routes
// app.use("/api/resume", resumeRoutes);
// app.use("/api/quiz", quizRoutes);
// app.use("/api/home", homeRoutes);
// app.use("/api", searchRoutes);
// //app.use("/api/profile", profileRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/achievements", achievementsRoutes);
// app.use("/api/leaderboard",leaderboardRoutes);
// app.use("/api/opportunities", opportunitiesRoutes);
// app.use("/api", recQuizRoutes);
// app.use("/api/students", studentRoutes);
// const PORT = 5000;
// app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));