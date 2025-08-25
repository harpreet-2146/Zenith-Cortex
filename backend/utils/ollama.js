const axios = require("axios");

async function callOllama(prompt) {
  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "gemma:2b",
    prompt,
    stream: false
  });

  // Adjust depending on Ollama version
  return response.data.response || response.data.choices?.[0]?.text;
}

module.exports = { callOllama };
