const express = require("express");
const cors = require("cors");

const resumeRoutes = require("./routes/resume");
const quizRoutes = require("./routes/quiz");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/resume", resumeRoutes);
app.use("/api/quiz", quizRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
