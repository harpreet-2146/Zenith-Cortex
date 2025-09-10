const express = require("express");
const router = express.Router();

const studentDB = require("../utils/db");       // db.json for students
const recmenDB = require("../utils/recmendb");  // recmendb.json for recruiters/mentors

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Students
  const student = studentDB.get("students").find({ username, password }).value();
  if (student) {
    return res.json({ ...student, role: "student" });
  }

  // Recruiters
  const recruiter = recmenDB.get("recruiters").find({ username, password }).value();
  if (recruiter) {
    return res.json({ ...recruiter, role: "recruiter" });
  }

  // Mentors
  const mentor = recmenDB.get("mentors").find({ username, password }).value();
  if (mentor) {
    return res.json({ ...mentor, role: "mentor" });
  }

  // Fail
  res.status(401).json({ message: "Invalid credentials" });
});

module.exports = router;



// // backend/routes/auth.js only student login
// const express = require("express");
// const db = require("../utils/db");
// const router = express.Router();

// // POST /api/auth/login
// router.post("/login", (req, res) => {
//   const { username, password } = req.body;

//   const user = db.get("users").find({ username, password }).value();

//   if (!user) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   // Return full user object including role
//   res.json({
//     id: user.id,
//     username: user.username,
//     role: user.role,       // student / faculty / recruiter
//     name: user.name,
//     srn: user.srn,
//     class: user.class,
//     year: user.year,
//     branch: user.branch,
//     department: user.department,
//   });
// });

// module.exports = router;
