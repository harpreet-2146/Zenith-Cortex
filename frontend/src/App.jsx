// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";

// Pages
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import MentorHub from "./pages/MentorHub";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Resume from "./pages/Resume";
import Login from "./pages/Login";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected Layout */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/mentorhub" element={<MentorHub />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/resume" element={<Resume />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
