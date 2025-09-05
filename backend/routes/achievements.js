// backend/routes/achievements.js
const express = require("express");
const db = require("../utils/db");
const router = express.Router();

// GET all achievements
router.get("/", (req, res) => {
  const achievements = db.get("achievements").value();
  res.json(achievements);
});

// POST a new achievement
router.post("/", (req, res) => {
  const newAchievement = req.body;

  // Add id if missing
  if (!newAchievement.id) newAchievement.id = Date.now();

  db.get("achievements").push(newAchievement).write();

  res.json(newAchievement);
});

module.exports = router;
