import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between">
      <h1 className="font-bold text-xl">Zenith Cortex</h1>
      <div className="space-x-4">
        <Link to="/resume">Resume</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/mentorhub">Mentor Hub</Link>
      </div>
    </nav>
  );
}

