import React, { useState } from "react";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a resume first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Server error: " + res.status);
      }

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error("❌ Error:", err);
      setResult("Error analysing resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Resume Analyzer</h1>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Analysing..." : "Analyse Resume"}
      </button>

      {result && (
        <div className="mt-6 text-left p-4 border rounded-lg bg-gray-100">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
