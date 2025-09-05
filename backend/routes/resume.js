const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { callVertex } = require("../utils/vertex");
const { extractJson } = require("../utils/jsonHelper");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/analyse-file", upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;
    const targetRole = req.body.targetRole || "Not specified";

    if (!file) return res.status(400).json({ error: "File missing" });

    let text = "";
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      text = data.text;
    } else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {
      const { value } = await mammoth.extractRawText({ buffer: file.buffer });
      text = value;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const prompt = `
You are an ATS resume analyzer and career coach.
Analyze the following resume and return the response in **strict JSON format only**.

SCHEMA:
{
  "atsScore": "<integer 1–5>",
  "pros": ["list of strong points"],
  "cons": ["list of weaknesses"],
  "improvements": ["list of specific recommendations to make resume stronger"],
  "keywordSuggestions": ["list of missing but important keywords for the target role"]
}

Resume Content:
${text}

Target Job Role: ${targetRole}

IMPORTANT:
- atsScore must be 1–5 only (5 = excellent match, 1 = poor match).
- pros/cons should be detailed but concise.
- improvements must be actionable.
- keywordSuggestions should be tailored to the job role.
- Output ONLY valid JSON, no explanations.
    `;

    const raw = await callVertex(prompt);

    let parsed = extractJson(raw);

    if (!parsed) {
      console.error("Failed to parse Vertex response:", raw);
      return res.status(502).json({ error: "AI returned non-JSON or unparsable output", raw });
    }

    res.json(parsed);
  } catch (err) {
    console.error("Error analysing resume:", err);
    res.status(500).json({ error: "Failed to analyse resume" });
  }
});

module.exports = router;
