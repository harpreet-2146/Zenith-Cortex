const express = require("express");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const router = express.Router();

// Setup lowdb with FileSync adapter
const adapter = new FileSync("db.json");
const db = require("../utils/db");


// Ensure default structure
db.defaults({ users: [] }).write();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = db
    .get("users")
    .find({ username: username, password: password })
    .value();

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  res.json({
    success: true,
    role: user.role,
    profile: user.profile,
  });
});

module.exports = router;
