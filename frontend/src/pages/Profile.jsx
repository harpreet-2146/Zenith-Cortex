// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    points: "",
    category: "",
    github: "",
    linkedin: "",
    certificate: "",
    model: "",
    visibility: "public",
  });

  const userId = 1; // Dummy logged-in user

  useEffect(() => {
    // Fetch user info
    axios.get(`http://localhost:5000/api/user/${userId}`).then((res) => {
      setUser(res.data);
    });

    // Fetch achievements
    axios.get("http://localhost:5000/api/profile").then((res) => {
      setAchievements(res.data.filter((a) => a.userId === userId));
    });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure at least one proof is provided
    if (!form.github && !form.linkedin && !form.certificate && !form.model) {
      alert("Please provide at least one proof (GitHub/LinkedIn/Model/Certificate).");
      return;
    }

    const payload = { ...form, userId };
    const res = await axios.post(
      "http://localhost:5000/api/profile/add",
      payload
    );
    setAchievements([...achievements, res.data.achievement]);

    setForm({
      title: "",
      description: "",
      points: "",
      category: "",
      github: "",
      linkedin: "",
      certificate: "",
      model: "",
      visibility: "public",
    });
  };

  return (
    <div className="p-6">
      {user && (
        <div className="flex items-center mb-6 space-x-4">
          <img
            src={user.photo}
            alt="Profile"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">SRN: {user.srn}</p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Add New Achievement</h2>
      <form className="mb-6 space-y-2" onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (max 300 chars)"
          maxLength={300}
          className="border p-2 rounded w-full"
          required
        />
        <input
          name="points"
          value={form.points}
          onChange={handleChange}
          placeholder="Points"
          type="number"
          className="border p-2 rounded w-full"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="border p-2 rounded w-full"
        />
        <input
          name="github"
          value={form.github}
          onChange={handleChange}
          placeholder="GitHub Link"
          className="border p-2 rounded w-full"
        />
        <input
          name="linkedin"
          value={form.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn Link"
          className="border p-2 rounded w-full"
        />
        <input
          name="model"
          value={form.model}
          onChange={handleChange}
          placeholder="Working Model Link"
          className="border p-2 rounded w-full"
        />
        <input
          name="certificate"
          value={form.certificate}
          onChange={handleChange}
          placeholder="Certificate Link"
          className="border p-2 rounded w-full"
        />
        <select
          name="visibility"
          value={form.visibility}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Achievement
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">My Achievements</h2>
      <ul className="space-y-2">
        {achievements.map((a) => (
          <li key={a.id} className="border p-2 rounded shadow">
            <strong>{a.title}</strong> – {a.points} pts
            <p>{a.description}</p>
            <div className="flex space-x-2">
              {a.github && (
                <a href={a.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              )}
              {a.linkedin && (
                <a href={a.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              )}
              {a.model && (
                <a href={a.model} target="_blank" rel="noreferrer">
                  Model
                </a>
              )}
              {a.certificate && (
                <a href={a.certificate} target="_blank" rel="noreferrer">
                  Certificate
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
