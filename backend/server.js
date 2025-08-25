const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fetch = require("node-fetch"); // important!

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Multer setup (file uploads)
const upload = multer({ dest: "uploads/" });

// Helper: extract text from uploaded resume
async function extractText(file) {
  const ext = file.originalname.split(".").pop().toLowerCase();

  if (ext === "pdf") {
    const dataBuffer = fs.readFileSync(file.path);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (ext === "docx") {
    const data = await mammoth.extractRawText({ path: file.path });
    return data.value;
  } else if (ext === "txt") {
    return fs.readFileSync(file.path, "utf-8");
  } else {
    throw new Error("Unsupported file format. Please upload PDF, DOCX, or TXT.");
  }
}

// Helper: call Ollama API
async function callOllama(prompt) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gemma:2b",
      prompt,
      stream: false, // wait for full response
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response;
}

// API: Analyse Resume
app.post("/api/analyse", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const resumeText = await extractText(req.file);

    const prompt = `
Analyse this resume for ATS compatibility, strengths, and weaknesses.
Provide output in sections:

1. **ATS Score (0-100)**
2. **Strengths**
3. **Weaknesses**
4. **Suggestions to Improve**

Resume:
${resumeText}
    `;

    const analysis = await callOllama(prompt);

    // cleanup uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ result: analysis });
  } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Error analysing resume. Check backend logs." });
}

});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
