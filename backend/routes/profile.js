// backend/routes/profile.js
const express = require("express");
const db = require("../utils/db.js");

const router = express.Router();

// GET all achievements
router.get("/", async (req, res) => {
  await db.read();
  res.json(db.data.achievements);
});

// POST new achievement
router.post("/add", async (req, res) => {
  const {
    userId,
    title,
    description,
    points,
    date,
    category,
    github,
    linkedin,
    certificate,
    visibility,
  } = req.body;

  if (!userId || !title || !description) {
    return res
      .status(400)
      .json({ error: "userId, title, and description are required" });
  }

  await db.read();
  const newAchievement = {
    id: db.data.achievements.length + 1,
    userId,
    title,
    description,
    points: points || 0,
    date: date || new Date().toISOString(),
    category: category || "General",
    github: github || "",
    linkedin: linkedin || "",
    certificate: certificate || "",
    visibility: visibility || "public",
  };

  db.data.achievements.push(newAchievement);
  await db.write();

  res.json({ success: true, achievement: newAchievement });
});

module.exports = router; // 👈 CommonJS export
