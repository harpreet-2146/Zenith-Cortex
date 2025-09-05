const { VertexAI } = require('@google-cloud/vertexai');
require("dotenv").config();

const project = process.env.GOOGLE_PROJECT;
const location = process.env.GOOGLE_LOCATION;

// ✅ Model name (no publishers/google/models)
const model = "gemini-2.0-flash-001";

const vertexAI = new VertexAI({ project, location });

const generativeModel = vertexAI.getGenerativeModel({ model });

// 🔹 Helper: extract first valid JSON from model output
function extractJson(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return null;
  } catch (err) {
    console.error("JSON parse error:", err.message);
    return null;
  }
}

async function callVertex(prompt) {
  try {
    const resp = await generativeModel.generateContent(prompt);
    const response = resp.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const json = extractJson(text);
    return json || { raw: text }; // fallback
  } catch (err) {
    console.error("Vertex AI error:", err.message);
    throw err;
  }
}

module.exports = { callVertex };
