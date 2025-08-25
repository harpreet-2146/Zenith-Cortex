// backend/server.js
const express = require("express");
const cors = require("cors");
const resumeRoutes = require("./routes/resume");

const app = express();
app.use(cors());
app.use(express.json());

// Use the Resume route
app.use("/api/resume", resumeRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
