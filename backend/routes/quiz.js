// backend/routes/quiz.js
const express = require("express");
const router = express.Router();
const { callOllama } = require("../utils/ollama");

/* Helper: attempt to extract JSON from messy text (handles code fences / extra text) */
function extractJson(text) {
  if (!text || typeof text !== "string") return null;
  // remove common code fences markers
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
  // fallback: try to find first {...} or [...]
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

/* Normalize topProfessions: ensure objects, take top 5, and scale percentages to sum ≈100 */
function normalizeTopProfessions(list) {
  if (!Array.isArray(list)) return [];
  // convert to object form
  let items = list.map(entry => {
    if (typeof entry === "string") return { profession: entry, matchPercentage: 0, reasons: [] };
    if (entry && typeof entry === "object") {
      return {
        profession: String(entry.profession || entry.title || entry.name || "").trim(),
        matchPercentage: Number(entry.matchPercentage ?? entry.percentage ?? entry.score ?? 0),
        reasons: Array.isArray(entry.reasons) ? entry.reasons : []
      };
    }
    return null;
  }).filter(Boolean).filter(it => it.profession);

  items = items.slice(0, 5);
  if (!items.length) return [];

  const sumRaw = items.reduce((s, it) => s + (isFinite(it.matchPercentage) ? it.matchPercentage : 0), 0);

  if (sumRaw <= 0) {
    // even split if AI didn't provide numbers
    const even = Math.floor(100 / items.length);
    items.forEach((it, i) => it.matchPercentage = even);
    items[0].matchPercentage += 100 - even * items.length;
    return items;
  }

  // scale to total 100
  let scaled = items.map(it => ({ ...it, matchPercentage: (it.matchPercentage / sumRaw) * 100 }));
  let rounded = scaled.map(it => ({ ...it, matchPercentage: Math.round(it.matchPercentage) }));
  let total = rounded.reduce((s, it) => s + it.matchPercentage, 0);
  let diff = 100 - total;
  for (let i = 0; diff !== 0 && i < rounded.length; i++) {
    rounded[i].matchPercentage += diff > 0 ? 1 : -1;
    diff += diff > 0 ? -1 : 1;
  }
  return rounded;
}

/* ensure roadmap structure for each profession */
function ensureRoadmapStructure(rm) {
  return {
    beginner: Array.isArray(rm?.beginner) ? rm.beginner : [],
    intermediate: Array.isArray(rm?.intermediate) ? rm.intermediate : [],
    advanced: Array.isArray(rm?.advanced) ? rm.advanced : []
  };
}

router.post("/analyze", async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "No answers provided (expected array)" });
    }

    const prompt = `
You are Gemma (model gemma:2b) — an expert career advisor and roadmap generator.
You will receive a JSON array of the user's selected quiz answers. Analyze them carefully and produce ONLY valid JSON (no explanation, no code fences).

REQUIRED OUTPUT SCHEMA:
{
  "topProfessions": [
    { "profession": "Software Engineer", "matchPercentage": 88, "reasons": ["answer1","answer2"] },
    ...
  ],
  "roadmaps": {
    "Software Engineer": {
      "beginner": [ { "title": "Learn Python basics", "why": "foundation for problem solving" }, ... ],
      "intermediate": [ { "title": "Build a full-stack app", "why": "end-to-end experience" }, ... ],
      "advanced": [ { "title": "Design scalable systems", "why": "prepare for senior roles" }, ... ]
    },
    "Data Scientist": { "beginner": [...], "intermediate": [...], "advanced": [...] }
  }
}

INSTRUCTIONS:
- Provide exactly 5 top professions (or fewer if strongly justified).
- matchPercentage must be integer 0–100 and should be realistic based on the user's answers. Make them roughly sum to 100 across the top professions.
- Each profession entry should include concise "reasons" that clearly tie to the user's answers (don't invent unrelated facts).
- For each profession in topProfessions, include a corresponding roadmap object in "roadmaps" with beginner/intermediate/advanced arrays (2–5 actionable items per level; items can be strings or objects with title+why).
- Keep outputs concise. DO NOT output any text outside the JSON object.

User answers (array):
${JSON.stringify(answers, null, 2)}
`;

    // call the shared util, which sends to http://localhost:11434/api/generate with model gemma:2b
    const raw = await callOllama(prompt);
    console.log("Raw AI response (quiz):", raw && raw.slice ? raw.slice(0, 1000) : raw);

    // try strict parse then fallback to extractor
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

    // normalize top professions & roadmaps
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


