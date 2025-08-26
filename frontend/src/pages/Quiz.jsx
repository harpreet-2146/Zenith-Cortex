import React, { useState } from "react";
import quizQuestions from "../data/quiz.questions.json";

export default function Quiz() {
  const questions = quizQuestions || [];
  const PAGE_SIZE = 4;

  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  if (!questions.length) return <p>No quiz questions available.</p>;

  const currentPageQuestions = questions.slice(
    pageIndex * PAGE_SIZE,
    (pageIndex + 1) * PAGE_SIZE
  );

  const handleAnswer = (qIndex, option) => {
    const globalIndex = pageIndex * PAGE_SIZE + qIndex;
    const updatedAnswers = [...answers];
    updatedAnswers[globalIndex] = option;
    setAnswers(updatedAnswers);
  };

  const nextPage = () => {
    if ((pageIndex + 1) * PAGE_SIZE >= questions.length) {
      setShowResults(true);
      analyzeResults(answers);
    } else {
      setPageIndex(pageIndex + 1);
    }
  };

  const analyzeResults = async (answersArray) => {
    try {
      const res = await fetch("http://localhost:5000/api/quiz/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersArray }),
      });
      const data = await res.json();
      setAiResult(data.result);
    } catch (err) {
      console.error("Error analyzing quiz:", err);
      setAiResult({ error: "Failed to analyze quiz results." });
    }
  };

  if (showResults) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Quiz Results</h1>
        {aiResult?.error ? (
          <p className="text-red-500">{aiResult.error}</p>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded bg-green-50">
              <h2 className="font-bold">Top Professions</h2>
              <ul className="list-disc ml-6">
                {aiResult.topProfessions?.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 border rounded bg-blue-50">
              <h2 className="font-bold">Roadmap</h2>
              <p>{aiResult.roadmap}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Quiz</h1>
      {currentPageQuestions.map((q, idx) => (
        <div key={idx} className="p-4 border rounded bg-gray-50 mb-4">
          <p className="font-semibold mb-2">
            Question {pageIndex * PAGE_SIZE + idx + 1} of {questions.length}
          </p>
          <p className="mb-2">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(idx, opt)}
                className={`w-full py-2 px-4 border rounded hover:bg-blue-100 ${
                  answers[pageIndex * PAGE_SIZE + idx] === opt
                    ? "bg-blue-200"
                    : ""
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={nextPage}
        className="w-full py-2 bg-blue-600 text-white rounded-lg"
      >
        {pageIndex * PAGE_SIZE + PAGE_SIZE >= questions.length
          ? "Finish Quiz"
          : "Next Page"}
      </button>
    </div>
  );
}
