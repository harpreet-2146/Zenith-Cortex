import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";   // ✅ useAuth, not AuthContext

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();   // ✅ direct hook
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Try logging in with db.js endpoint first
    let res;
    try {
      res = await axios.post("http://localhost:5000/api/auth/login", {
      username,
      password,
      });
    } catch (err) {
      // If db.js fails, try recmendb.js endpoint
      res = await axios.post("http://localhost:5000/api/auth/login/recmendb", {
      username,
      password,
      });
    }

    // normalize user object
    const normalizedUser = { ...res.data.user, role: res.data.role };

    login(normalizedUser);

    if (res.data.role === "student") navigate("/home");
    else if (res.data.role === "mentor") navigate("/mentorhub");
    else if (res.data.role === "recruiter") navigate("/rechome");
  } catch (err) {
    console.error(err);
    alert("Login failed: Invalid username or password");
  }
};


  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="password"   // ✅ better than text
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}
