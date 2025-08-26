const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware so req.body works
app.use(cors());
app.use(express.json()); // <-- this line is critical!

// Routes
const quizRoutes = require("./routes/quiz");
app.use("/api/quiz", quizRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
