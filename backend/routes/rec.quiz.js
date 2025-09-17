// backend/routes/rec.quiz.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const router = express.Router();

// load lowdb (so we use same source as your other routes)
const adapter = new FileSync(path.join(__dirname, "../db.json"));
const db = low(adapter);
db.read(); // ensure data loaded

// Quick test route: visit http://localhost:5000/api/recquiz/test
router.get("/recquiz/test", (req, res) => {
  console.log("📌 rec.quiz.js test route hit");
  res.json({ message: "RecQuiz route working ✅" });
});

/**
 * POST /api/recquiz/analyse
 * Body: { answers: [ "Computer Science (CSE)", "AWS", "3rd Year", ... ] }
 *
 * Behaviour:
 *  - Treat `answers` as keywords/preferences.
 *  - Match students whose department/year match any branch/year answers OR
 *    whose achievements contain any of the answers as substring (case-insensitive).
 *  - Return enriched student objects + the achievements that matched.
 */
router.post("/recquiz/analyse", (req, res) => {
  try {
    // Safely get body
    const body = req.body || {};
    const answersRaw = body.answers;

    if (!answersRaw || !Array.isArray(answersRaw)) {
      return res.status(400).json({ error: "Please send answers as an array" });
    }

    // Normalize answers -> lowercase trimmed strings; remove empties
    const answers = answersRaw
      .map(a => (typeof a === "string" ? a.trim().toLowerCase() : ""))
      .filter(Boolean);

    if (answers.length === 0) {
      return res.status(400).json({ error: "No valid filters provided" });
    }

    // Read fresh DB data (in case it changed)
    db.read();
    const users = db.get("users").value() || db.get("students").value() || [];
    const achievements = db.get("achievements").value() || [];

    // Only students
    const students = users.filter(u => u.role === "student");

    // Helper: check if student matches any branch/year filter
    function basicProfileMatch(student) {
      const dept = (student.department || "").toLowerCase();
      const yearStr = student.year ? `${student.year}`.toLowerCase() : "";
      // check any answer is substring of dept or matches year variants
      return answers.some(ans => {
        if (!ans) return false;
        if (dept && dept.includes(ans)) return true;
        // allow "3rd year" vs "3" matching - check digits
        if (yearStr && yearStr.includes(ans)) return true;
        if (ans.endsWith("year") && ans.includes(`${yearStr}`)) return true;
        return false;
      });
    }

    // Helper: check achievements for keyword matches
    function achievementMatches(student) {
      const studentAchievements = achievements.filter(a => {
        const sid = a.studentId || a.userId || null;
        return sid === student.id;
      });

      // for each achievement check if any answer appears in title or description
      const matched = studentAchievements.filter(a => {
        const title = (a.title || "").toLowerCase();
        const desc = (a.description || "").toLowerCase();
        return answers.some(ans => title.includes(ans) || desc.includes(ans));
      });

      return matched; // array (may be empty)
    }

    // Build matches: we consider a student a match if:
    //  - basicProfileMatch OR they have >=1 achievementMatches
    const results = students.map(student => {
      const profileMatched = basicProfileMatch(student);
      const matchedAchievements = achievementMatches(student);
      const matched = profileMatched || matchedAchievements.length > 0;

      return {
        student,
        matched,
        matchedAchievements,
        reason: {
          profileMatched,
          achievementCount: matchedAchievements.length,
        },
      };
    }).filter(r => r.matched);

    // Map to a friendly response: student info + matched achievements + brief reason
    const response = results.map(r => {
      const user = r.student;
      return {
        id: user.id,
        name: user.name,
        department: user.department,
        year: user.year,
        avatar: user.avatar || null,
        totalPoints: user.totalPoints || 0,
        matchedAchievements: r.matchedAchievements.map(a => ({
          id: a.id,
          title: a.title,
          domain: a.domain,
          description: a.description,
          proof: a.proof,
          points: a.points,
        })),
        reason: r.reason,
      };
    });

    return res.json({ matches: response });
  } catch (err) {
    console.error("Error in rec.quiz:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

