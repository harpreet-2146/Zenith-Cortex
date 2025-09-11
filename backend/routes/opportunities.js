// backend/routes/opportunities.js
const express = require("express");
const db = require("../utils/db");
const router = express.Router();

// GET all opportunities
router.get("/", (req, res) => {
  const opps = db.get("opportunities").value() || [];
  res.json(opps);
});

// POST new opportunity
router.post("/", (req, res) => {
  const { title, description, mentorId, mentorName } = req.body;
  if (!title || !description || !mentorId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const id = Date.now();
  const newOpp = { id, title, description, mentorId, mentorName };

  db.get("opportunities").push(newOpp).write();
  res.status(201).json(newOpp);
});

module.exports = router;
