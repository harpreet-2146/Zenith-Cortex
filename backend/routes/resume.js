const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { callOllama } = require("../utils/ollama");

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
Role: You are Gemma, acting as a detailed ATS (Applicant Tracking System) resume analyzer.

Task: Analyze the provided resume with a focus on ATS Score, Detailed Pros, Detailed Cons, and Recommendations for Improvement.

Resume:
${text}

Target Job Role: ${targetRole}
`;

    const analysis = await callOllama(prompt);
    res.json({ analysis });
  } catch (err) {
    console.error("Error analysing resume:", err);
    res.status(500).json({ error: "Failed to analyse resume" });
  }
});

module.exports = router;
