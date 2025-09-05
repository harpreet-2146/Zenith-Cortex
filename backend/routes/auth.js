
// backend/routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import db from "../utils/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role, username: user.username },
    JWT_SECRET,
    { expiresIn: "365d" } // 1 year
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, srn: user.srn, role: user.role, avatar: user.avatar }
  });
});

export default router;
