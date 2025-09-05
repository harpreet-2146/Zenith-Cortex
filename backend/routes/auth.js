// backend/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");

const router = express.Router();
const JWT_SECRET = "supersecret123"; // you can move this to .env later

// Login route
router.post("/login", (req, res) => {
  const { username, password, role } = req.body;

  // Search for user in db
  const user = db.get("users").find({ username, password, role }).value();

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1y" }
  );

  // Return token + user info (without password)
  res.json({ token, user: { ...user, password: undefined } });
});

module.exports = router;
