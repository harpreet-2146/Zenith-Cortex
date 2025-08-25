// backend/server.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const fetch = require("node-fetch"); // for Ollama calls

const app = express();
const PORT = 5000;

// Multer setup (for file uploads)
const upload = multer({ dest: "uploads/" });

// -------------------------
// Call Ollama
// -------------------------
async function callOllama(resumeText) {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma:2b",
        prompt: `
You are an ATS (Applicant Tracking System) resume analyzer. 
Analyze the following resume text and provide a structured report with these sections:

## ATS Score (0-100)

## Strengths

## Weaknesses

## Suggestions to Improve

Resume Content:
${resumeText}
        `,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || "No response from Ollama";
  } catch (err) {
    console.error("❌ Error in callOllama:", err);
    throw err;
  }
}

// -------------------------
// API Route
// -------------------------
app.post("/api/analyse", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    console.log("✅ Resume parsed, sending to Ollama...");

    const result = await callOllama(resumeText);

    // cleanup uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ result });
  } catch (err) {
    console.error("❌ Error analysing resume:", err);
    res.status(500).json({ error: "Error analysing resume. Check backend logs." });
  }
});

// -------------------------
// Start Server
// -------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
