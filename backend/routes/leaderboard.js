// backend/routes/leaderboard.js
const express = require("express");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const router = express.Router();
const adapter = new JSONFile("db.json");
const db = new Low(adapter);

// GET /api/leaderboard?department=CSE&branch=AI%20ML&year=2
router.get("/", async (req, res) => {
  try {
    await db.read();
    const { department, branch, year } = req.query;
    let users = db.data.users || [];

    // Apply filters
    if (department) users = users.filter((u) => u.department === department);
    if (branch) users = users.filter((u) => u.branch === branch);
    if (year) users = users.filter((u) => String(u.year) === String(year));

    if (users.length === 0) {
      return res.status(404).json({ error: "No students found for these filters." });
    }

    // Sort by points (descending)
    users.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

    // Dense ranking
    let rank = 0;
    let lastScore = null;
    users.forEach((u, i) => {
      if (u.totalPoints !== lastScore) {
        rank++;
        lastScore = u.totalPoints;
      }
      u.rank = rank;
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

module.exports = router;
