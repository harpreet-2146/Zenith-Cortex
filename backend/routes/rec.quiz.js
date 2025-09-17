const express = require("express");
const router = express.Router();
const { readDb } = require("../utils/db"); // adjust to your db helper

// POST: recruiter submits preferences, return matching students
router.post("/analyze", async (req, res) => {
  try {
    const answers = req.body.answers || {};
    const db = await readDb();

    // Here you can make filtering smarter. For now, return all students.
    const students = db.students || [];

    res.json({
      success: true,
      matches: students.map((s) => ({
        id: s.id,
        name: s.name,
        srn: s.srn,
        avatar: s.avatar,
        totalPoints: s.totalPoints,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to analyze recruiter quiz" });
  }
});

module.exports = router;
