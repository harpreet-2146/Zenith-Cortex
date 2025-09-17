const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dbPath = path.resolve("db.json");

// ✅ POST recruiter quiz submission
router.post("/rec-quiz", async (req, res) => {
  try {
    const { recruiterId, answers } = req.body;
    if (!recruiterId || !answers) {
      return res.status(400).json({ error: "Missing recruiterId or answers" });
    }

    // read db.json
    const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

    if (!data.recQuizSubmissions) data.recQuizSubmissions = [];
    data.recQuizSubmissions.push({
      recruiterId,
      answers,
      submittedAt: new Date(),
    });

    // write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.json({ message: "Recruiter quiz submitted successfully" });
  } catch (err) {
    console.error("Error saving recruiter quiz:", err);
    res.status(500).json({ error: "Failed to submit recruiter quiz" });
  }
});

module.exports = router;
