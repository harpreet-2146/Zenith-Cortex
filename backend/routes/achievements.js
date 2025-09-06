router.post("/add", upload.single("proofFile"), async (req, res) => {
  const { title, description, link, userId } = req.body;

  await db.read();
  db.data ||= { users: [], achievements: [] }; // fallback again

  const user = db.data.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  let proofUrl = req.file ? `/uploads/${req.file.filename}` : link || null;

  const achievement = {
    id: Date.now(),
    userId,
    title,
    description,
    proof: proofUrl,
    points: 10
  };

  db.data.achievements.push(achievement);
  await db.write();

  res.json({ message: "Achievement added", achievement });
});


// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const db = require("../utils/db");

// const router = express.Router();

// // storage for uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // make sure uploads/ exists in backend root
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// // POST add achievement
// router.post("/add", upload.single("proofFile"), async (req, res) => {
//   try {
//     const { title, description, link, userId } = req.body;

//     const user = db.data.users.find(u => u.id === parseInt(userId));
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // fallback: make sure user has achievements array
//     if (!user.achievements) {
//       user.achievements = [];
//     }

//     let proofUrl = null;
//     if (req.file) {
//       proofUrl = `/uploads/${req.file.filename}`;
//     } else if (link) {
//       proofUrl = link;
//     }

//     const achievement = {
//       id: Date.now(),
//       title,
//       description,
//       proof: proofUrl,
//       points: 10
//     };

//     user.achievements.push(achievement);
//     await db.write();

//     res.json({ message: "Achievement added", achievement });
//   } catch (err) {
//     console.error("Error adding achievement:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // GET achievements by userId
// router.get("/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = db.data.users.find(u => u.id === parseInt(userId));

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user.achievements || []);
//   } catch (err) {
//     console.error("Error fetching achievements:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// module.exports = router;
