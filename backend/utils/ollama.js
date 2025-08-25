// backend/utils/ollama.js
const axios = require("axios");

async function callOllama(prompt) {
  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "gemma:2b",
    prompt,
    stream: false
  });

  return response.data.response; // or response.data.choices[0].text depending on Ollama version
}

module.exports = { callOllama };

