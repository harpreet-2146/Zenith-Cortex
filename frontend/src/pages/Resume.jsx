import { useState } from "react";
import { simpleATS } from "../utils/simpleATS";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const onUpload = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      const r = simpleATS(f.name); // mock scorer
      setResult(r);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Resume Scorer</h1>
      <input type="file" accept=".pdf,.doc,.docx" onChange={onUpload} className="mb-4" />

      {result && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold mb-2">ATS Score</h2>
            <div className="text-4xl font-bold">{result.score}</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold mb-2">Strengths</h2>
            <ul className="list-disc ml-5 space-y-1">
              {result.pros.map((p,i)=><li key={i}>{p}</li>)}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold mb-2">Improvements</h2>
            <ul className="list-disc ml-5 space-y-1">
              {result.cons.map((c,i)=><li key={i}>{c}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
