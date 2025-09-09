import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";

// Pages
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import MentorHub from "./pages/MentorHub";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Resume from "./pages/Resume";
import Login from "./pages/Login";
import RecQuiz from "./pages/RecQuiz";       // new
import RecProfile from "./pages/RecProfile"; // new

// ProtectedRoute
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const role = localStorage.getItem("role");

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected Layout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Home (same for all) */}
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* Student Only */}
            {role === "student" && (
              <>
                <Route path="/resume" element={<Resume />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/mentorhub" element={<MentorHub />} />
                <Route path="/quiz" element={<Quiz />} />
              </>
            )}

            {/* Recruiter Only */}
            {role === "recruiter" && (
              <>
                <Route path="/recquiz" element={<RecQuiz />} />
                <Route path="/recprofile" element={<RecProfile />} />
              </>
            )}

            {/* Shared */}
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}



// // src/App.jsx
// import React, { useContext } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import { AuthProvider} from "./context/AuthContext";
// import { useAuth } from "./context/AuthContext";
// import MainLayout from "./layouts/MainLayout";

// // Pages
// import Home from "./pages/Home";
// import Leaderboard from "./pages/Leaderboard";
// import MentorHub from "./pages/MentorHub";
// import Profile from "./pages/Profile";
// import Quiz from "./pages/Quiz";
// import Resume from "./pages/Resume";
// import Login from "./pages/Login";

// // ProtectedRoute component
// function ProtectedRoute({ children }) {
//   const { user } = useAuth();
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public */}
//           <Route path="/login" element={<Login />} />

//           {/* Protected Layout */}
//           <Route
//             element={
//               <ProtectedRoute>
//                 <MainLayout />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<Home />} />
//             <Route path="/leaderboard" element={<Leaderboard />} />
//             <Route path="/mentorhub" element={<MentorHub />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/quiz" element={<Quiz />} />
//             <Route path="/resume" element={<Resume />} />
//           </Route>

//           {/* Catch-all */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }




