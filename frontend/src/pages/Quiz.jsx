import { useState } from "react";
import qs from "../data/quiz.questions.json";
import rmaps from "../data/roadmaps.json";

const DOMAIN_TO_CAREERS = {
  software: ["Software Engineer"],
  data: ["Data Scientist"],
  design: ["UX Designer"],
  pm: ["Product Manager"]
};

export default function Quiz() {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const toggle = (id) => setAnswers(a => ({...a, [id]: !(a[id])}));

  const submit = () => {
    // score domains
    const domainScores = {};
    qs.forEach(q => {
      if (answers[q.id]) {
        domainScores[q.domain] = (domainScores[q.domain] || 0) + q.weight;
      }
    });
    // map to careers + percent
    const out = Object.entries(domainScores).flatMap(([dom,score]) =>
      DOMAIN_TO_CAREERS[dom].map(c => ({ career:c, match: Math.min(score*10, 95)}))
    ).sort((a,b)=>b.match-a.match).slice(0,10);
    setResults(out);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Career Fit Quiz</h1>

      {!results && (
        <>
          <div className="space-y-3 mb-4">
            {qs.map(q=>(
              <label key={q.id} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow">
                <input type="checkbox" checked={!!answers[q.id]} onChange={()=>toggle(q.id)} />
                <span>{q.text}</span>
              </label>
            ))}
          </div>
          <button onClick={submit} className="bg-gray-900 text-white px-4 py-2 rounded-xl">Get Results</button>
        </>
      )}

      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Top Matches</h2>
          {results.map((r,i)=>(
            <details key={i} className="bg-white rounded-xl shadow">
              <summary className="cursor-pointer list-none px-4 py-3 flex justify-between">
                <span>{r.career}</span><span className="font-semibold">{r.match}%</span>
              </summary>
              <div className="px-6 pb-4">
                <ol className="list-decimal ml-6 space-y-1">
                  {(rmaps[r.career] || ["Roadmap coming soon"]).map((step,idx)=><li key={idx}>{step}</li>)}
                </ol>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

