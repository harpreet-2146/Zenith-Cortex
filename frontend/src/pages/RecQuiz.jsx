import React, { useState } from "react";
import recQuestions from "../data/rec.questions.json";

export default function RecQuiz() {
  const questions = Array.isArray(recQuestions) ? recQuestions : [];

  const [answers, setAnswers] = useState({});

  if (!questions.length) return <p className="p-6">No recruiter questions available.</p>;

  const handleSelect = (id, option, type) => {
    setAnswers((prev) => {
      if (type === "multi-select") {
        const current = prev[id] || [];
        if (current.includes(option)) {
          return { ...prev, [id]: current.filter((o) => o !== option) };
        } else {
          return { ...prev, [id]: [...current, option] };
        }
      } else {
        return { ...prev, [id]: option };
      }
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Recruiter Preferences</h1>

      {questions.map((q) => (
        <div
          key={q.id}
          className="p-4 mb-4 rounded bg-gradient-to-r from-blue-100 to-blue-200 shadow"
        >
          <p className="font-semibold mb-2">{q.question}</p>

          {q.type === "text" ? (
            <input
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              className="w-full border rounded p-2"
              placeholder="Type your answer..."
            />
          ) : (
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(q.id, opt, q.type)}
                  className={`w-full py-2 px-4 rounded border transition ${
                    q.type === "multi-select"
                      ? (answers[q.id] || []).includes(opt)
                        ? "bg-green-200 border-green-400"
                        : "bg-white hover:bg-green-100 border-gray-300"
                      : answers[q.id] === opt
                      ? "bg-green-200 border-green-400"
                      : "bg-white hover:bg-green-100 border-gray-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      <pre className="bg-gray-100 p-4 rounded mt-6">
        {JSON.stringify(answers, null, 2)}
      </pre>
    </div>
  );
}
