import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-4">
      <ul className="space-y-4">
        <li><Link to="/resume">📄 Resume</Link></li>
        <li><Link to="/profile">👤 Profile</Link></li>
        <li><Link to="/quiz">📝 Quiz</Link></li>
        <li><Link to="/leaderboard">🏆 Leaderboard</Link></li>
        <li><Link to="/mentorhub">🤝 Mentor Hub</Link></li>
      </ul>
    </aside>
  );
}

