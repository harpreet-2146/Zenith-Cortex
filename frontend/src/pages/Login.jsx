import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");

  const submit = (e) => {
    e.preventDefault();
    login(name || "Guest", role);
    nav("/");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input className="w-full border rounded p-2" placeholder="Your name" value={name}
               onChange={(e)=>setName(e.target.value)} />
        <select className="w-full border rounded p-2" value={role} onChange={(e)=>setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
          <option value="faculty">Faculty</option>
        </select>
        <button className="w-full bg-gray-900 text-white rounded p-2">Continue</button>
      </form>
    </div>
  );
}
