import React, { useState } from "react";
import recQuestionsRaw from "../data/rec.questions.json"; // 👈 adjust if needed

export default function RecQuiz() {
  // Ensure array
  const recQuestions = Array.isArray(recQuestionsRaw) ? recQuestionsRaw : [];

  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);

  const handleChange = (qid, option) => {
    setAnswers(prev => {
      const current = prev[qid] || [];
      if (current.includes(option)) {
        return { ...prev, [qid]: current.filter(o => o !== option) };
      } else {
        return { ...prev, [qid]: [...current, option] };
      }
    });
  };

  const handleAnalyse = async () => {
    const selectedAnswers = Object.values(answers).flat();
    try {
      const res = await fetch("http://localhost:5000/api/recquiz/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: selectedAnswers }),
      });
      const data = await res.json();
      setResults(data.matches || []);
    } catch (err) {
      console.error("Error analysing:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Recruiter Quiz</h1>

      {/* Quiz Questions */}
      <div className="space-y-6">
        {recQuestions.length > 0 ? (
          recQuestions.map((q, idx) => (
            <div key={idx} className="p-4 rounded-2xl shadow-md bg-pink-50">
              <h2 className="text-lg font-semibold mb-3">{q.question}</h2>
              <div className="space-y-2">
                {Array.isArray(q.options) &&
                  q.options.map((opt, oIdx) => (
                    <label
                      key={oIdx}
                      className="flex items-center space-x-3 p-2 rounded-xl cursor-pointer bg-white hover:bg-pink-100 transition"
                    >
                      <input
                        type="checkbox"
                        checked={answers[q.id]?.includes(opt) || false}
                        onChange={() => handleChange(q.id, opt)}
                        className="h-4 w-4 accent-pink-400"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No recruiter questions found.</p>
        )}
      </div>

      {/* Analyse Button */}
      <button
        onClick={handleAnalyse}
        className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-bold rounded-2xl shadow-md transition"
      >
        Analyse
      </button>

      {/* Results */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Matching Students:</h2>
        {results.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {results.map((student, idx) => (
              <li
                key={idx}
                className="p-4 rounded-xl bg-green-50 shadow flex flex-col"
              >
                <span className="font-bold">{student.name}</span>
                <span className="text-sm text-gray-600">
                  {student.department} • Year {student.year}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-gray-500">No matches yet.</p>
        )}
      </div>
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


