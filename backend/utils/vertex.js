// backend/utils/vertex.js
const { VertexAI } = require("@google-cloud/vertexai");
require("dotenv").config();

const project = process.env.GOOGLE_PROJECT;
const location = process.env.GOOGLE_LOCATION;

// ✅ Correct Gemini model
const model = "gemini-2.0-flash-001";

const vertexAI = new VertexAI({ project, location });

const generativeModel = vertexAI.getGenerativeModel({
  model,
});

/**
 * Calls Vertex AI and forces JSON output
 */
async function callVertex(prompt) {
  try {
    const resp = await generativeModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
        responseMimeType: "application/json", // 👈 force JSON
      },
    });

    const response = await resp.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return text.trim();
  } catch (err) {
    console.error("Vertex AI error:", err.message);
    throw err;
  }
}

module.exports = { callVertex };
