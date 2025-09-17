import React, { useState } from "react";
import quizQuestions from "../data/quiz.questions.json";
import usersData from "../data/users.json"; // import your users.json

export default function Quiz() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const PAGE_SIZE = 4;
  const questions = Array.isArray(quizQuestions) ? quizQuestions : [];

  const handleFinish = () => {
    setShowResults(true); // switch to student list
  };

  if (showResults) {
    return (
      <div>
        <h2>🏆 Students Leaderboard</h2>
        <ul>
          {usersData.users.map((student) => (
            <li key={student.id} style={{ margin: "10px 0" }}>
              <img
                src={student.avatar}
                alt={student.name}
                width={40}
                height={40}
                style={{ borderRadius: "50%", marginRight: "10px" }}
              />
              <strong>{student.name}</strong> ({student.srn}) — 
              {student.totalPoints} points
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const start = currentPage * PAGE_SIZE;
  const currentQuestions = questions.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <h2>Quiz</h2>
      {currentQuestions.map((q, index) => (
        <div key={index} style={{ margin: "20px 0" }}>
          <h4>{q.question}</h4>
          <ul>
            {q.options.map((option, i) => (
              <li key={i}>
                <button>{option}</button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {start + PAGE_SIZE < questions.length ? (
        <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      ) : (
        <button onClick={handleFinish}>Finish</button>
      )}
    </div>
  );
}


// import React, { useState } from "react";
// import recQuestions from "../data/rec.questions.json";

// export default function RecQuiz() {
//   const questions = Array.isArray(recQuestions) ? recQuestions : [];

//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   if (!questions.length) {
//     return <p className="p-6">No recruiter questions available.</p>;
//   }

//   const handleSelect = (id, option, type) => {
//     setAnswers((prev) => {
//       if (type === "multi-select") {
//         const current = prev[id] || [];
//         return current.includes(option)
//           ? { ...prev, [id]: current.filter((o) => o !== option) }
//           : { ...prev, [id]: [...current, option] };
//       }
//       return { ...prev, [id]: option };
//     });
//   };

//   const handleText = (id, value) => {
//     setAnswers((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSubmit = async () => {
//     setSubmitted(true);

//     // 🔹 later you’ll send answers to backend here
//     // Example:
//     // const res = await fetch("http://localhost:5000/api/rec/analyze", {
//     //   method: "POST",
//     //   headers: { "Content-Type": "application/json" },
//     //   body: JSON.stringify({ answers }),
//     // });
//     // const data = await res.json();
//     // setMatches(data.matches);
//   };

//   if (submitted) {
//     return (
//       <div className="p-6 max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold text-center mb-6">
//           Recruiter Results
//         </h1>
//         <p className="mb-4">You submitted the following preferences:</p>
//         <pre className="bg-gray-100 p-4 rounded">
//           {JSON.stringify(answers, null, 2)}
//         </pre>
//         {/* 🔹 Later: Show matched students here */}
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 text-center">
//         Recruiter Preferences
//       </h1>

//       {questions.map((q) => (
//         <div
//           key={q.id}
//           className="p-4 mb-4 rounded bg-gradient-to-r from-blue-100 to-blue-200 shadow"
//         >
//           <p className="font-semibold mb-2">{q.question}</p>

//           {q.type === "text" ? (
//             <input
//               type="text"
//               value={answers[q.id] || ""}
//               onChange={(e) => handleText(q.id, e.target.value)}
//               className="w-full border rounded p-2"
//               placeholder="Type your answer..."
//             />
//           ) : (
//             <div className="space-y-2">
//               {q.options.map((opt, i) => (
//                 <button
//                   key={i}
//                   onClick={() => handleSelect(q.id, opt, q.type)}
//                   className={`w-full py-2 px-4 rounded border transition ${
//                     q.type === "multi-select"
//                       ? (answers[q.id] || []).includes(opt)
//                         ? "bg-green-200 border-green-400"
//                         : "bg-white hover:bg-green-100 border-gray-300"
//                       : answers[q.id] === opt
//                       ? "bg-green-200 border-green-400"
//                       : "bg-white hover:bg-green-100 border-gray-300"
//                   }`}
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}

//       <button
//         onClick={handleSubmit}
//         className="w-full py-2 rounded-lg bg-gradient-to-r from-green-200 to-green-300 text-gray-800 font-medium hover:opacity-90"
//       >
//         Finish & Analyze
//       </button>
//     </div>
//   );
// }


