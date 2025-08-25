import React, { useState } from "react";
import axios from "axios";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a resume first");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysis(res.data);
    } catch (err) {
      console.error(err);
      alert("Error analysing resume. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
        Upload Resume – Find Your ATS Score
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Upload your resume and get ATS scores, pros, and cons instantly.
      </p>

      <label className="flex flex-col items-center justify-center w-full h-40 px-4 transition bg-gray-100 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-gray-200">
        <span className="flex items-center space-x-2 text-gray-600">
          {file ? (
            <span className="font-medium">{file.name}</span>
          ) : (
            <span>Drag & Drop your file here or click to upload</span>
          )}
        </span>
        <input type="file" className="hidden" onChange={handleFileChange} />
      </label>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-6 w-full py-3 px-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Analysing..." : "Analyse Resume"}
      </button>

      {/* Sectioned Result */}
      {analysis && (
        <div className="mt-8 space-y-6">
          {/* ATS Score */}
          <div className="flex flex-col items-center bg-gray-100 p-6 rounded-2xl shadow">
            <h2 className="font-bold text-lg text-gray-700 mb-4">ATS Score</h2>
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32">
                <circle
                  className="text-gray-300"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="50"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-blue-600"
                  strokeWidth="10"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="50"
                  cx="64"
                  cy="64"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={
                    2 * Math.PI * 50 -
                    (parseInt(analysis.ats_score) / 100) * 2 * Math.PI * 50
                  }
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-800">
                {analysis.ats_score}
              </span>
            </div>
          </div>

          {/* Pros */}
          <div className="bg-green-100 p-4 rounded-2xl shadow">
            <h2 className="font-bold text-lg text-green-700 mb-2">Pros</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{analysis.pros}</p>
          </div>

          {/* Cons */}
          <div className="bg-red-100 p-4 rounded-2xl shadow">
            <h2 className="font-bold text-lg text-red-700 mb-2">Cons</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{analysis.cons}</p>
          </div>
        </div>
      )}
    </div>
  );
}
