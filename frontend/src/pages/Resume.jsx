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
    if (!file) {
      alert("Please upload a resume first!");
      return;
    }

    setLoading(true);

    try {
      // Extract text
      const text = await extractText(file);

      const res = await fetch("http://localhost:5000/api/resume/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text, targetRole })
      });

      const data = await res.json();
      setResult(parseResult(data.analysis)); // parse bullet points into sections
    } catch (err) {
      console.error("❌ Error:", err);
      setResult({ error: "Error analysing resume. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const extractText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        if (file.type === "application/pdf") {
          const pdf = await import("pdf-parse");
          const data = await pdf.default(typedArray);
          resolve(data.text);
        } else {
          const mammoth = await import("mammoth");
          const { value } = await mammoth.extractRawText({ arrayBuffer: typedArray.buffer });
          resolve(value);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const parseResult = (text) => {
    const sections = text.split(/(?=ATS Score:|Detailed Pros:|Detailed Cons:|Recommendations)/);
    const parsed = {};
    sections.forEach((sec) => {
      if (sec.includes("ATS Score")) parsed.ats = sec.replace("ATS Score:", "").trim();
      else if (sec.includes("Detailed Pros")) parsed.pros = sec.replace("Detailed Pros:", "").trim();
      else if (sec.includes("Detailed Cons")) parsed.cons = sec.replace("Detailed Cons:", "").trim();
      else if (sec.includes("Recommendations")) parsed.recommendations = sec.replace("Recommendations for Improvement:", "").trim();
    });
    return parsed;
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
          {result.ats && (
            <div className="p-4 border rounded bg-green-50">
              <h2 className="font-bold">ATS Score</h2>
              <p>{result.ats}</p>
            </div>
          )}
          {result.pros && (
            <div className="p-4 border rounded bg-blue-50">
              <h2 className="font-bold">Detailed Pros</h2>
              <p>{result.pros}</p>
            </div>
          )}
          {result.cons && (
            <div className="p-4 border rounded bg-red-50">
              <h2 className="font-bold">Detailed Cons</h2>
              <p>{result.cons}</p>
            </div>
          )}
          {result.recommendations && (
            <div className="p-4 border rounded bg-yellow-50">
              <h2 className="font-bold">Recommendations</h2>
              <p>{result.recommendations}</p>
            </div>
          )}
        </div>
      )}

      {result?.error && <p className="text-red-500 font-bold">{result.error}</p>}
    </div>
  );
}
