// backend/routes/auth.js
const express = require("express");
const db = require("../utils/db");
const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = db.get("users").find({ username, password }).value();

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Return full user object including role
  res.json({
    id: user.id,
    username: user.username,
    role: user.role,       // student / faculty / recruiter
    name: user.name,
    srn: user.srn,
    class: user.class,
    year: user.year,
    branch: user.branch,
    department: user.department,
  });
});

module.exports = router;
