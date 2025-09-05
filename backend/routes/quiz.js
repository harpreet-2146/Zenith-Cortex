// backend/routes/quiz.js
const express = require("express");
const router = express.Router();
const { callVertex } = require("../utils/vertex");

/* --- Helper: extract JSON safely --- */
function extractJson(text) {
  if (!text || typeof text !== "string") return null;
  let cleaned = text.replace(/```(?:json|js|txt)?/gi, "```");
  if (cleaned.includes("```")) {
    const parts = cleaned.split("```").filter(Boolean);
    for (const p of parts) {
      const m = p.match(/({[\s\S]*}|\[[\s\S]*\])/);
      if (m) {
        try { return JSON.parse(m[0]); } catch {}
      }
    }
  }
  const objMatch = text.match(/{[\s\S]*}/);
  if (objMatch) {
    try { return JSON.parse(objMatch[0]); } catch {}
  }
  const arrMatch = text.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0]); } catch {}
  }
  return null;
}

/* --- Normalize professions: top 5, keep percentages independent --- */
function normalizeTopProfessions(list) {
  if (!Array.isArray(list)) return [];
  let items = list.map(entry => {
    if (typeof entry === "string") {
      return { profession: entry, matchPercentage: 0, reasons: [] };
    }
    if (entry && typeof entry === "object") {
      return {
        profession: String(entry.profession || entry.title || entry.name || "").trim(),
        matchPercentage: Math.min(
          100,
          Math.max(0, Number(entry.matchPercentage ?? entry.percentage ?? entry.score ?? 0))
        ),
        reasons: Array.isArray(entry.reasons) ? entry.reasons : []
      };
    }
    return null;
  }).filter(Boolean).filter(it => it.profession);

  return items.slice(0, 5);
}

/* --- Ensure roadmap structure --- */
function ensureRoadmapStructure(rm) {
  return {
    beginner: Array.isArray(rm?.beginner) ? rm.beginner : [],
    intermediate: Array.isArray(rm?.intermediate) ? rm.intermediate : [],
    advanced: Array.isArray(rm?.advanced) ? rm.advanced : []
  };
}

/* --- Route: analyze quiz answers --- */
router.post("/analyze", async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "No answers provided (expected array)" });
    }

    const prompt = `
You are an expert career advisor and roadmap generator.
You will receive a JSON array of the user's selected quiz answers. Analyze them carefully and produce ONLY valid JSON (no explanation, no code fences).

REQUIRED OUTPUT SCHEMA:
{
  "topProfessions": [
    { "profession": "Software Engineer", "matchPercentage": 92, "reasons": ["answer1","answer2"] }
  ],
  "roadmaps": {
    "Software Engineer": {
      "beginner": [ { "title": "Learn Python basics", "why": "foundation for problem solving" } ],
      "intermediate": [ { "title": "Build a full-stack app", "why": "end-to-end experience" } ],
      "advanced": [ { "title": "Design scalable systems", "why": "prepare for senior roles" } ]
    }
  }
}

User answers (array):
${JSON.stringify(answers, null, 2)}

IMPORTANT:
- Provide exactly 5 top professions (or fewer if strongly justified).
- matchPercentage must be an integer **0–100**, scored **independently** for each profession (NOT rescaled to sum 100).
- Each profession must have a roadmap.
- Output ONLY valid JSON, nothing else.
`;

    const raw = await callVertex(prompt);
    console.log("Raw AI response (quiz):", raw && raw.slice ? raw.slice(0, 1000) : raw);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      parsed = extractJson(raw);
    }

    if (!parsed || typeof parsed !== "object") {
      console.error("Failed parsing AI JSON:", raw);
      return res.status(502).json({ error: "AI returned non-JSON or unparsable output", raw });
    }

    const topRaw = parsed.topProfessions || parsed.professions || parsed.results || [];
    const normalizedTop = normalizeTopProfessions(topRaw);

    const givenRoadmaps = parsed.roadmaps || parsed.roadmap || {};
    const normalizedRoadmaps = {};
    for (const p of normalizedTop) {
      normalizedRoadmaps[p.profession] = ensureRoadmapStructure(givenRoadmaps[p.profession] || {});
    }

    return res.json({
      topProfessions: normalizedTop,
      roadmaps: normalizedRoadmaps
    });
  } catch (err) {
    console.error("Error analyzing quiz:", err);
    return res.status(500).json({ error: "Failed to analyze quiz results", details: String(err) });
  }
});

module.exports = router;
