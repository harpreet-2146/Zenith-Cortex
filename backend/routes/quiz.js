const express = require("express");
const router = express.Router();
const { callOllama } = require("../utils/ollama");

router.post("/analyze", async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !answers.length)
      return res.status(400).json({ error: "No answers provided" });

    // Build a prompt for AI
    const prompt = `
You are an expert career advisor AI.
Analyze the following quiz answers: ${JSON.stringify(
      answers
    )}.
Provide:
1. Top 5 professions matching these answers.
2. A detailed roadmap to start a career in the most suitable profession.
Respond in JSON format:
{
  "topProfessions": ["", "", "", "", ""],
  "roadmap": "..."
}
`;

    const analysis = await callOllama(prompt);

    let result;
    try {
      result = JSON.parse(analysis);
    } catch {
      result = { topProfessions: [], roadmap: analysis };
    }

    res.json({ result });
  } catch (err) {
    console.error("Error analyzing quiz:", err);
    res.status(500).json({ error: "Failed to analyze quiz results" });
  }
});

module.exports = router;
