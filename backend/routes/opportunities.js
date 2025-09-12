// backend/routes/opportunities.js
const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

// Ensure defaults
db.defaults({ opportunities: [] }).write();

// GET all opportunities
router.get("/", (req, res) => {
  const opportunities = db.get("opportunities").value();
  res.json(opportunities);
});

// POST new opportunity
router.post("/", (req, res) => {
  const {
    title,
    description,
    type,
    venue,
    date,
    time,
    registrationLink,
    postedBy,
    mentorId,
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const newOpportunity = {
    id: Date.now(),
    title,
    description,
    type: type || "General", // ✅ save type
    venue: venue || "TBA",   // ✅ save venue
    date: date || "",        // ✅ save date
    time: time || "",        // ✅ save time
    registrationLink: registrationLink || "",
    postedBy: postedBy || "Unknown Mentor", // ✅ show professor name
    mentorId: mentorId || null,
  };

  db.get("opportunities").push(newOpportunity).write();
  res.status(201).json(newOpportunity);
});

module.exports = router;


// // backend/routes/opportunities.js
// const express = require("express");
// const router = express.Router();

// const low = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");

// // Setup lowdb v1 with FileSync
// const adapter = new FileSync("db.json");
// const db = low(adapter);

// // Default structure if not already present
// db.defaults({ opportunities: [] }).write();

// /**
//  * GET all opportunities
//  * Used in Student's MentorHub.jsx to fetch & display opportunities
//  */
// router.get("/", (req, res) => {
//   try {
//     const opportunities = db.get("opportunities").value();
//     res.json(opportunities);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching opportunities" });
//   }
// });

// /**
//  * POST a new opportunity
//  * Used in MentorOpportunities.jsx to create new hackathons/workshops/etc.
//  */
// router.post("/", (req, res) => {
//   try {
//     const { title, description, type, venue, date, registrationLink } = req.body;

//     if (!title || !description || !type || !venue || !date || !registrationLink) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const newOpportunity = {
//       id: Date.now().toString(), // unique ID
//       title,
//       description,
//       type, // e.g. "Hackathon", "Workshop", "Conference"
//       venue,
//       date,
//       registrationLink,
//       createdAt: new Date().toISOString(),
//     };

//     db.get("opportunities").push(newOpportunity).write();

//     res.status(201).json(newOpportunity);
//   } catch (err) {
//     res.status(500).json({ error: "Error adding opportunity" });
//   }
// });

// module.exports = router;


// // backend/routes/opportunities.js
// const express = require("express");
// const db = require("../utils/db");
// const router = express.Router();

// // GET all opportunities
// router.get("/", (req, res) => {
//   const opps = db.get("opportunities").value() || [];
//   res.json(opps);
// });

// // POST new opportunity
// router.post("/", (req, res) => {
//   const { title, description, mentorId, mentorName } = req.body;
//   if (!title || !description || !mentorId) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const id = Date.now();
//   const newOpp = { id, title, description, mentorId, mentorName };

//   db.get("opportunities").push(newOpp).write();
//   res.status(201).json(newOpp);
// });

// module.exports = router;
