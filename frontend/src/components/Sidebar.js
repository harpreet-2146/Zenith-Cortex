import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen w-56 bg-gray-100 shadow-md flex flex-col p-4 gap-3">
      <Link to="/" className="hover:bg-blue-200 p-2 rounded">Dashboard</Link>
      <Link to="/quiz" className="hover:bg-blue-200 p-2 rounded">Career Quiz</Link>
      <Link to="/leaderboard" className="hover:bg-blue-200 p-2 rounded">Leaderboard</Link>
      <Link to="/mentor" className="hover:bg-blue-200 p-2 rounded">Mentor Hub</Link>
      <Link to="/resume" className="hover:bg-blue-200 p-2 rounded">Resume Builder</Link>
      <Link to="/profile" className="hover:bg-blue-200 p-2 rounded">Profile</Link>
    </div>
  );
};

export default Sidebar;
