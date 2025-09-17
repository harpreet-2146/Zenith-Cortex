// backend/routes/rec.quiz.js
const express = require("express");
const router = express.Router();
const db = require("../utils/db"); // lowdb wrapper

// POST /api/recquiz/analyse
router.post("/recquiz/analyse", async (req, res) => {
  try {
    const { answers } = req.body; // recruiter’s selected criteria (array)

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid answers format" });
    }

    // Load students from db.json
    await db.read();
    const allStudents = db.data?.users?.filter(u => u.role === "student") || [];

    // Match students based on recruiter’s answers
    const matching = allStudents.filter(student => {
      return answers.every(ans =>
        (student.skills && student.skills.includes(ans)) ||
        (student.department && student.department === ans) ||
        (student.year && String(student.year) === String(ans)) ||
        (student.class && student.class === ans)
      );
    });

    res.json({ matches: matching });
  } catch (error) {
    console.error("Error in rec.quiz:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
