import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const role = localStorage.getItem("role");

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-white"
      >
        ❌
      </button>

      <ul className="mt-10 space-y-6">
        {/* Home (same for all) */}
        <li>
          <Link to="/home" onClick={toggleSidebar}>🏠 Home</Link>
        </li>

        {/* Student-only links */}
        {role === "student" && (
          <>
            <li><Link to="/resume" onClick={toggleSidebar}>📄 Resume</Link></li>
            <li><Link to="/profile" onClick={toggleSidebar}>👤 Profile</Link></li>
            <li><Link to="/mentorhub" onClick={toggleSidebar}>🤝 Mentor Hub</Link></li>
            <li><Link to="/quiz" onClick={toggleSidebar}>📝 Student Quiz</Link></li>
          </>
        )}

        {/* Recruiter-only links */}
        {role === "recruiter" && (
          <>
            <li><Link to="/recquiz" onClick={toggleSidebar}>📝 Recruiter Quiz</Link></li>
            <li><Link to="/recprofile" onClick={toggleSidebar}>👤 Recruiter Profile</Link></li>
          </>
        )}

        {/* Shared */}
        <li><Link to="/leaderboard" onClick={toggleSidebar}>🏆 Leaderboard</Link></li>
      </ul>
    </aside>
  );
}



// import { Link } from "react-router-dom";

// export default function Sidebar({ isOpen, toggleSidebar }) {
//   return (
//     <aside
//       className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 transform ${
//         isOpen ? "translate-x-0" : "-translate-x-full"
//       } transition-transform duration-300 ease-in-out z-50`}
//     >
//       <button
//         onClick={toggleSidebar}
//         className="absolute top-4 right-4 text-white"
//       >
//         ❌
//       </button>
//       <ul className="mt-10 space-y-6">
//         <li><Link to="/home" onClick={toggleSidebar}>🏠 Home</Link></li>
//         <li><Link to="/resume" onClick={toggleSidebar}>📄 Resume</Link></li>
//         <li><Link to="/profile" onClick={toggleSidebar}>👤 Profile</Link></li>
//         <li><Link to="/quiz" onClick={toggleSidebar}>📝 Quiz</Link></li>
//         <li><Link to="/leaderboard" onClick={toggleSidebar}>🏆 Leaderboard</Link></li>
//         <li><Link to="/mentorhub" onClick={toggleSidebar}>🤝 Mentor Hub</Link></li>
//       </ul>
//     </aside>
//   );
// }


