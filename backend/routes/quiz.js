const express = require("express");
const router = express.Router();
const { callOllama } = require("../utils/ollama");

/**
 * Robust JSON extractor: handles code fences, stray text, arrays/objects.
 */
function extractJson(text) {
  if (!text || typeof text !== "string") return null;

  // strip code fences if present
  const fenced = text.replace(/```(?:json)?/gi, "```");
  if (fenced.includes("```")) {
    const parts = fenced.split("```").filter(Boolean);
    // try blocks that look like JSON
    for (const p of parts) {
      const m = p.match(/^[\s\S]*?({[\s\S]*}|\[[\s\S]*\])[\s\S]*?$/);
      if (m) {
        try { return JSON.parse(m[1]); } catch {}
      }
    }
  }

  // try to grab the first {...} or [...]
  const mObj = text.match(/{[\s\S]*}/);
  if (mObj) {
    try { return JSON.parse(mObj[0]); } catch {}
  }
  const mArr = text.match(/\[[\s\S]*\]/);
  if (mArr) {
    try { return JSON.parse(mArr[0]); } catch {}
  }
  return null;
}

function normalizeTopProfessions(list) {
  // Accepts:
  // - [{ profession, matchPercentage, reasons? }, ...]
  // - ["Software Engineer", ...]
  if (!Array.isArray(list)) return [];

  // Ensure objects with profession + matchPercentage
  let items = list.map((x) => {
    if (typeof x === "string") return { profession: x, matchPercentage: 0, reasons: [] };
    if (x && typeof x === "object") {
      return {
        profession: String(x.profession || x.title || x.name || "").trim(),
        matchPercentage: Number(x.matchPercentage ?? x.percentage ?? x.score ?? 0),
        reasons: Array.isArray(x.reasons) ? x.reasons : []
      };
    }
    return null;
  }).filter(Boolean).filter(x => x.profession);

  // Top 5 only
  items = items.slice(0, 5);

  // If all zeros, spread evenly
  const sum = items.reduce((s, it) => s + (isFinite(it.matchPercentage) ? it.matchPercentage : 0), 0);
  if (sum <= 0) {
    const even = Math.floor(100 / Math.max(items.length, 1));
    items.forEach((it) => it.matchPercentage = even);
    if (items.length) items[0].matchPercentage += 100 - (even * items.length);
    return items;
  }

  // Normalize to sum ~100
  let scaled = items.map((it) => ({ ...it, matchPercentage: (it.matchPercentage / sum) * 100 }));
  // round & fix remainder
  let rounded = scaled.map((it) => ({ ...it, matchPercentage: Math.round(it.matchPercentage) }));
  let total = rounded.reduce((s, it) => s + it.matchPercentage, 0);
  let diff = 100 - total;
  for (let i = 0; diff !== 0 && i < rounded.length; i++) {
    rounded[i].matchPercentage += diff > 0 ? 1 : -1;
    diff += diff > 0 ? -1 : 1;
  }
  return rounded;
}

router.post("/analyze", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "No answers provided (expected array of selected options)." });
    }

    // 🔒 Strict JSON prompt with schema and examples
    const prompt = `
You are an expert career advisor AI. You will receive a list of quiz answers (user selections).
Analyze them and return ONLY strict JSON following this schema. No extra commentary.

SCHEMA (example values included for shape only):
{
  "topProfessions": [
    { "profession": "Software Engineer", "matchPercentage": 88, "reasons": ["reason 1", "reason 2"] },
    { "profession": "Data Scientist", "matchPercentage": 76, "reasons": ["reason 1"] },
    { "profession": "UX Designer", "matchPercentage": 64, "reasons": [] },
    { "profession": "Project Manager", "matchPercentage": 52, "reasons": [] },
    { "profession": "Technical Writer", "matchPercentage": 40, "reasons": [] }
  ],
  "roadmaps": {
    "Software Engineer": {
      "beginner": [
        { "title": "Learn Programming Basics (Python or JS)", "why": "foundation for problem solving" },
        { "title": "Build 3 CLI mini-apps", "why": "practice control flow, functions, data structures" }
      ],
      "intermediate": [
        { "title": "Web App with Auth + DB", "why": "end-to-end product skills (REST, SQL)" }
      ],
      "advanced": [
        { "title": "Scale and Optimize", "why": "performance, testing, CI/CD, cloud" }
      ]
    },
    "Data Scientist": {
      "beginner": [{ "title": "Python + Numpy/Pandas", "why": "data wrangling" }],
      "intermediate": [{ "title": "ML Project (Classification)", "why": "modeling fundamentals" }],
      "advanced": [{ "title": "Deploy ML (API/Batches)", "why": "productionization" }]
    }
  }
}

CONSTRAINTS:
- "topProfessions" must contain 5 items max.
- "matchPercentage" must be numeric (0–100). Make them proportional to the evidence in answers.
- Include concise "reasons" tied to the user choices (do not invent unrelated claims).
- "roadmaps" must include entries for each profession listed in "topProfessions".
- Each roadmap level should have 2–5 concrete items with crisp, actionable titles and a short "why".
- Output ONLY valid JSON. Do not wrap in code fences.

User Answers:
${JSON.stringify(answers, null, 2)}
`;

    // 🔗 Call local Ollama (gemma:2b) via your shared util
    const raw = await callOllama(prompt);

    // Safely parse whatever Gemma returned
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = extractJson(raw);
    }
    if (!parsed || typeof parsed !== "object") {
      console.error("AI raw (unparseable):", raw);
      return res.status(502).json({ error: "AI returned non-JSON.", raw });
    }

    // Normalize topProfessions and ensure roadmaps exist per profession
    const normalizedTop = normalizeTopProfessions(parsed.topProfessions || parsed.professions || parsed.results || []);
    const roadmaps = parsed.roadmaps && typeof parsed.roadmaps === "object" ? parsed.roadmaps : {};

    // Ensure every listed profession has a roadmap object with levels
    const ensureLevels = (rm) => ({
      beginner: Array.isArray(rm?.beginner) ? rm.beginner : [],
      intermediate: Array.isArray(rm?.intermediate) ? rm.intermediate : [],
      advanced: Array.isArray(rm?.advanced) ? rm.advanced : []
    });

    const normalizedRoadmaps = {};
    for (const item of normalizedTop) {
      const key = item.profession;
      normalizedRoadmaps[key] = ensureLevels(roadmaps[key]);
    }

    return res.json({
      topProfessions: normalizedTop,
      roadmaps: normalizedRoadmaps,
      // include the raw for debugging in dev if needed:
      // _debugRaw: raw
    });

  } catch (err) {
    console.error("Error analyzing quiz:", err);
    return res.status(500).json({ error: "Failed to analyze quiz results" });
  }
});

module.exports = router;

