import React, { useState, useEffect } from "react";

export default function Quiz() {
  const [step, setStep] = useState(0); // 0 = first 10 questions, 1 = next 10, 2 = result
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");

  useEffect(() => {
    // fetch first 10 questions
    fetch("http://localhost:5000/api/quiz/start")
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions));
  }, []);

  const handleAnswer = (id, value) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[id - 1] = value;
      return updated;
    });
  };

  const handleNext = async () => {
    if (answers.length !== questions.length) {
      alert("Please answer all questions first");
      return;
    }

    setLoading(true);

    if (step === 0) {
      // send first 10 answers to backend
      try {
        const res = await fetch("http://localhost:5000/api/quiz/next", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
        const data = await res.json();
        setAllAnswers(answers);
        setAnswers([]);
        setQuestions(data.questions);
        setStep(1);
      } catch (err) {
        console.error(err);
        alert("Failed to generate next questions");
      } finally {
        setLoading(false);
      }
    } else if (step === 1) {
      // send all answers to backend for result
      try {
        const res = await fetch("http://localhost:5000/api/quiz/result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ allAnswers: [...allAnswers, ...answers], experienceLevel }),
        });
        const data = await res.json();
        setResult(data);
        setStep(2);
      } catch (err) {
        console.error(err);
        alert("Failed to generate result");
      } finally {
        setLoading(false);
      }
    }
  };

  if (step === 2 && result) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Quiz Result</h1>
        {result.professions?.map((prof, idx) => (
          <div key={idx} className="mb-4 p-4 border rounded bg-gray-50">
            <h2 className="font-bold text-lg">{idx + 1}. {prof.name}</h2>
            <pre className="whitespace-pre-wrap">{prof.roadmap}</pre>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Quiz</h1>
      {questions.map((q, idx) => (
        <div key={q.id} className="mb-4 p-4 border rounded bg-gray-50">
          <p className="font-semibold">{q.id}. {q.question}</p>
          {q.options?.map((opt) => (
            <label key={opt} className="block mt-1">
              <input
                type="radio"
                name={`q-${q.id}`}
                value={opt}
                checked={answers[idx] === opt}
                onChange={() => handleAnswer(q.id, opt)}
              /> {opt}
            </label>
          ))}
        </div>
      ))}
      <button
        onClick={handleNext}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Processing..." : step === 0 ? "Next 10 Questions" : "Get Result"}
      </button>

      <div className="mt-4">
        <label className="block mb-2">Experience Level:</label>
        <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>
    </div>
  );
}
