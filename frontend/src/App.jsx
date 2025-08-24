import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import MentorHub from "./pages/MentorHub";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <h2 className="text-2xl">Welcome to Zenith Cortex 🚀</h2>
            </MainLayout>
          }
        />
        <Route
          path="/resume"
          element={
            <MainLayout>
              <Resume />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
        <Route
          path="/quiz"
          element={
            <MainLayout>
              <Quiz />
            </MainLayout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <MainLayout>
              <Leaderboard />
            </MainLayout>
          }
        />
        <Route
          path="/mentorhub"
          element={
            <MainLayout>
              <MentorHub />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}
