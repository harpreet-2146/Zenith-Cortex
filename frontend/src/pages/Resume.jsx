import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState("");

  // Drag & drop handler
  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".pdf,.doc,.docx",
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return alert("Please upload a resume!");
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("targetRole", targetRole);

    try {
      const res = await fetch("http://localhost:5000/api/resume/analyse-file", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data.analysis);
    } catch (err) {
      console.error("❌ Error:", err);
      setResult({ error: "Error analysing resume. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Resume Analyzer</h1>

      <input
        type="text"
        placeholder="Target Job Role (optional)"
        value={targetRole}
        onChange={(e) => setTargetRole(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-10 rounded-lg text-center mb-4 cursor-pointer transition-colors ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {file ? <p>{file.name}</p> : <p>Drag & drop your resume here, or click to select</p>}
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded-lg mb-6"
      >
        {loading ? "Analysing..." : "Analyse Resume"}
      </button>

      {result && !result.error && (
          <div className="space-y-4">
  {result && (
    <>
      <div className="p-4 border rounded bg-green-50 break-words whitespace-pre-line">
        <h2 className="font-bold">ATS Score</h2>
        <div>{result.match(/ATS Score:[\s\S]*?(?=Recommendations for Improvement:|$)/)?.[0]}</div>
      </div>

      <div className="p-4 border rounded bg-yellow-50 break-words whitespace-pre-line">
        <h2 className="font-bold">Recommendations</h2>
        <div>{result.match(/Recommendations for Improvement:[\s\S]*/)?.[0]}</div>
      </div>
    </>
  )}
</div>

      )}

      {result?.error && <p className="text-red-500 font-bold">{result.error}</p>}
    </div>
  );
}
