// backend/routes/rec.quiz.js
const express = require("express");
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const router = express.Router();

// load the same db.json as other routes
const adapter = new FileSync(path.join(__dirname, "../db.json"));
const db = low(adapter);
db.read();

// quick test route
router.get("/recquiz/test", (req, res) => {
  console.log("📌 rec.quiz.js GET /recquiz/test hit");
  res.json({ message: "RecQuiz route working ✅" });
});

/**
 * POST /api/recquiz/analyse
 * Body: { answers: ["aws", "Computer Science (CSE)", "3rd Year", ...] }
 *
 * Returns debug info + matches
 */
router.post("/recquiz/analyse", (req, res) => {
  try {
    // safe read of request
    const body = req.body || {};
    const answersRaw = Array.isArray(body.answers) ? body.answers : [];

    console.log("🔎 /recquiz/analyse called with answersRaw:", answersRaw);

    // normalize keywords to lowercase trimmed
    const answers = answersRaw
      .filter(a => typeof a === "string" && a.trim().length > 0)
      .map(a => a.trim().toLowerCase());

    // Read fresh DB
    db.read();
    const users = db.get("users").value() || [];
    const achievements = db.get("achievements").value() || [];

    console.log(`🗂️ DB counts: users=${users.length}, achievements=${achievements.length}`);

    // If no filters, return nothing
    if (!answers.length) {
      return res.json({ debug: { answers, usersCount: users.length, achievementsCount: achievements.length }, matches: [] });
    }

    // Helpful debug: show achievements that match ANY keyword directly (title or desc)
    const directAchievementMatches = achievements.filter(a => {
      const title = (a.title || "").toLowerCase();
      const desc = (a.description || "").toLowerCase();
      return answers.some(ans => title.includes(ans) || desc.includes(ans));
    });

    console.log("🧾 directAchievementMatches (count):", directAchievementMatches.length);
    // Also show matching studentIds from those achievements
    const studentIdsFromAchievements = Array.from(new Set(directAchievementMatches.map(a => a.studentId || a.userId).filter(Boolean)));
    console.log("🆔 studentIdsFromAchievements:", studentIdsFromAchievements);

    // Now build matched students:
    const students = users.filter(u => u.role === "student");
    const matches = [];

    students.forEach(student => {
      const sid = student.id;
      // profile match: department or year string contains any answer
      const dept = (student.department || "").toLowerCase();
      const yearStr = student.year ? String(student.year).toLowerCase() : "";

      const profileMatched = answers.some(ans => {
        if (dept && dept.includes(ans)) return true;
        if (yearStr && (ans.includes(yearStr) || `${yearStr}th`.includes(ans) || `${yearStr}rd`.includes(ans))) return true;
        // allow "3rd year" or "3" matching
        if (ans.includes("year") && ans.includes(String(student.year))) return true;
        return false;
      });

      // achievement matches for that student
      const matchedAchievements = achievements.filter(a => {
        const aStudentId = a.studentId || a.userId || null;
        if (aStudentId !== sid) return false;
        const title = (a.title || "").toLowerCase();
        const desc = (a.description || "").toLowerCase();
        return answers.some(ans => title.includes(ans) || desc.includes(ans));
      });

      if (profileMatched || matchedAchievements.length > 0) {
        matches.push({
          id: student.id,
          name: student.name,
          department: student.department,
          year: student.year,
          avatar: student.avatar || null,
          totalPoints: student.totalPoints || 0,
          matchedAchievements: matchedAchievements.map(a => ({
            id: a.id,
            title: a.title,
            description: a.description,
            domain: a.domain,
            proof: a.proof,
            points: a.points
          })),
          reason: {
            profileMatched,
            achievementCount: matchedAchievements.length
          }
        });
      }
    });

    console.log("✅ total matched students:", matches.length);

    // Return debug info + matches so we can inspect
    res.json({
      debug: {
        answers,
        directAchievementMatchesCount: directAchievementMatches.length,
        studentIdsFromAchievements,
        usersCount: users.length,
        achievementsCount: achievements.length
      },
      matches
    });

  } catch (err) {
    console.error("Error in rec.quiz analyse:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;



// // backend/routes/rec.quiz.js
// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const low = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");

// const router = express.Router();

// // load lowdb (so we use same source as your other routes)
// const adapter = new FileSync(path.join(__dirname, "../db.json"));
// const db = low(adapter);
// db.read(); // ensure data loaded

// // Quick test route: visit http://localhost:5000/api/recquiz/test
// router.get("/recquiz/test", (req, res) => {
//   console.log("📌 rec.quiz.js test route hit");
//   res.json({ message: "RecQuiz route working ✅" });
// });

// /**
//  * POST /api/recquiz/analyse
//  * Body: { answers: [ "Computer Science (CSE)", "AWS", "3rd Year", ... ] }
//  *
//  * Behaviour:
//  *  - Treat `answers` as keywords/preferences.
//  *  - Match students whose department/year match any branch/year answers OR
//  *    whose achievements contain any of the answers as substring (case-insensitive).
//  *  - Return enriched student objects + the achievements that matched.
//  */
// router.post("/recquiz/analyse", (req, res) => {
//   try {
//     // Safely get body
//     const body = req.body || {};
//     const answersRaw = body.answers;

//     if (!answersRaw || !Array.isArray(answersRaw)) {
//       return res.status(400).json({ error: "Please send answers as an array" });
//     }

//     // Normalize answers -> lowercase trimmed strings; remove empties
//     const answers = answersRaw
//       .map(a => (typeof a === "string" ? a.trim().toLowerCase() : ""))
//       .filter(Boolean);

//     if (answers.length === 0) {
//       return res.status(400).json({ error: "No valid filters provided" });
//     }

//     // Read fresh DB data (in case it changed)
//     db.read();
//     const users = db.get("users").value() || db.get("students").value() || [];
//     const achievements = db.get("achievements").value() || [];

//     // Only students
//     const students = users.filter(u => u.role === "student");

//     // Helper: check if student matches any branch/year filter
//     function basicProfileMatch(student) {
//       const dept = (student.department || "").toLowerCase();
//       const yearStr = student.year ? `${student.year}`.toLowerCase() : "";
//       // check any answer is substring of dept or matches year variants
//       return answers.some(ans => {
//         if (!ans) return false;
//         if (dept && dept.includes(ans)) return true;
//         // allow "3rd year" vs "3" matching - check digits
//         if (yearStr && yearStr.includes(ans)) return true;
//         if (ans.endsWith("year") && ans.includes(`${yearStr}`)) return true;
//         return false;
//       });
//     }

//     // Helper: check achievements for keyword matches
//     function achievementMatches(student) {
//       const studentAchievements = achievements.filter(a => {
//         const sid = a.studentId || a.userId || null;
//         return sid === student.id;
//       });

//       // for each achievement check if any answer appears in title or description
//       const matched = studentAchievements.filter(a => {
//         const title = (a.title || "").toLowerCase();
//         const desc = (a.description || "").toLowerCase();
//         return answers.some(ans => title.includes(ans) || desc.includes(ans));
//       });

//       return matched; // array (may be empty)
//     }

//     // Build matches: we consider a student a match if:
//     //  - basicProfileMatch OR they have >=1 achievementMatches
//     const results = students.map(student => {
//       const profileMatched = basicProfileMatch(student);
//       const matchedAchievements = achievementMatches(student);
//       const matched = profileMatched || matchedAchievements.length > 0;

//       return {
//         student,
//         matched,
//         matchedAchievements,
//         reason: {
//           profileMatched,
//           achievementCount: matchedAchievements.length,
//         },
//       };
//     }).filter(r => r.matched);

//     // Map to a friendly response: student info + matched achievements + brief reason
//     const response = results.map(r => {
//       const user = r.student;
//       return {
//         id: user.id,
//         name: user.name,
//         department: user.department,
//         year: user.year,
//         avatar: user.avatar || null,
//         totalPoints: user.totalPoints || 0,
//         matchedAchievements: r.matchedAchievements.map(a => ({
//           id: a.id,
//           title: a.title,
//           domain: a.domain,
//           description: a.description,
//           proof: a.proof,
//           points: a.points,
//         })),
//         reason: r.reason,
//       };
//     });

//     return res.json({ matches: response });
//   } catch (err) {
//     console.error("Error in rec.quiz:", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;

