// backend/routes/resume.js
const express = require("express");
const router = express.Router();
const { callOllama } = require("../utils/ollama");

router.post("/analyse", async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "Resume text is required" });
    }

    const prompt = `
Role: You are Gemma, acting as a detailed ATS (Applicant Tracking System) resume analyzer.

Task: Analyze the provided resume with a focus on the following elements.

Output Format (use bullet points under each section, keep tone formal and professional):

Resume Analysis Summary:
- Introduction: Provide a brief overview of the resume and its purpose.

ATS Score:
- [Estimated ATS score out of 100 with a one-line explanation]

Detailed Pros:
- [List specific strengths of the resume: formatting, keyword usage, clarity, achievements, etc.]

Detailed Cons:
- [List specific weaknesses or ATS-related issues: formatting problems, missing keywords, weak descriptions, etc.]

Recommendations for Improvement:
- [Provide actionable, role-specific suggestions to improve ATS compatibility and impact]

Resume:
${resumeText}

Target Job Role: ${targetRole || "Not specified"}
    `;

    const analysis = await callOllama(prompt);

    res.json({ analysis });
    console.log("🚀 Resume analyse endpoint hit"); 
console.log("Received resume text length:", resumeText.length);
console.log("Target role:", targetRole);

  } catch (err) {

    console.error("Error analysing resume:", err);
    res.status(500).json({ error: "Failed to analyse resume" });
  }
});

module.exports = router;
