import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import MentorHub from "./pages/MentorHub";

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/mentorhub" element={<MentorHub />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
