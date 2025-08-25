const express = require("express");
const router = express.Router();
const { callOllama } = require("../utils/ollama");

// Dummy first 10 questions (can be replaced with JSON file later)
const firstQuestions = [
  { id: 1, question: "Do you enjoy problem-solving?", type: "single", options: ["Yes", "No"] },
  { id: 2, question: "Do you prefer working with data or people?", type: "single", options: ["Data", "People"] },
  { id: 3, question: "Are you comfortable with coding?", type: "single", options: ["Yes", "No"] },
  { id: 4, question: "Do you like creative design tasks?", type: "single", options: ["Yes", "No"] },
  { id: 5, question: "Do you prefer structured or unstructured work?", type: "single", options: ["Structured", "Unstructured"] },
  { id: 6, question: "Do you like working under pressure?", type: "single", options: ["Yes", "No"] },
  { id: 7, question: "Are you interested in AI/ML technologies?", type: "single", options: ["Yes", "No"] },
  { id: 8, question: "Do you enjoy analytical thinking?", type: "single", options: ["Yes", "No"] },
  { id: 9, question: "Do you prefer team work or solo work?", type: "single", options: ["Team", "Solo"] },
  { id: 10, question: "Do you like problem-solving puzzles?", type: "single", options: ["Yes", "No"] }
];

// 1️⃣ Start - send first 10 questions
router.get("/start", (req, res) => {
  res.json({ questions: firstQuestions });
});

// 2️⃣ Next - AI generates next 10 questions based on first 10 answers
router.post("/next", async (req, res) => {
  try {
    const { answers } = req.body; // array of 10 answers

    if (!answers || answers.length !== 10) {
      return res.status(400).json({ error: "First 10 answers required" });
    }

    const prompt = `
You are a quiz AI. Based on the following answers, generate 10 follow-up questions that are personalized and advanced.
Answers: ${JSON.stringify(answers)}

Output format: JSON array, each element with {id, question, type, options}.
`;

    const aiResponse = await callOllama(prompt);

    // Ensure AI returns valid JSON
    let nextQuestions;
    try {
      nextQuestions = JSON.parse(aiResponse);
    } catch (e) {
      console.error("Failed parsing AI JSON:", aiResponse);
      return res.status(500).json({ error: "Failed to generate questions" });
    }

    res.json({ questions: nextQuestions });
  } catch (err) {
    console.error("Error generating next questions:", err);
    res.status(500).json({ error: "Failed to generate next questions" });
  }
});

// 3️⃣ Result - AI generates top 5 professions + roadmap
router.post("/result", async (req, res) => {
  try {
    const { allAnswers, experienceLevel } = req.body; // all 20 answers and user level

    if (!allAnswers || allAnswers.length < 10) {
      return res.status(400).json({ error: "Answers are required" });
    }

    const prompt = `
You are a career guidance AI. Based on the following answers from a 20-question quiz, provide:
1. Top 5 most suitable professions for the user
2. A roadmap for each profession tailored to their experience level: ${experienceLevel || "Intermediate"}

Answers: ${JSON.stringify(allAnswers)}

Output format: JSON with {professions: [{name, roadmap}]}
`;

    const aiResponse = await callOllama(prompt);

    let result;
    try {
      result = JSON.parse(aiResponse);
    } catch (e) {
      console.error("Failed parsing AI JSON:", aiResponse);
      return res.status(500).json({ error: "Failed to generate result" });
    }

    res.json(result);
  } catch (err) {
    console.error("Error generating result:", err);
    res.status(500).json({ error: "Failed to generate result" });
  }
});

module.exports = router;
