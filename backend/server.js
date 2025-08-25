// backend/server.js
const express = require("express");
const cors = require("cors");
const resumeRoutes = require("./routes/resume");
const quizRoutes = require("./routes/quiz"); // NEW

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // in case large JSON from quiz or resume

// Routes
app.use("/api/resume", resumeRoutes);
app.use("/api/quiz", quizRoutes); // NEW

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
