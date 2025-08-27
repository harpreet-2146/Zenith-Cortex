// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    points: '',
    category: '',
    github: '',
    linkedin: '',
    certificate: '',
    visibility: 'public'
  });

  const userId = 1; // Dummy logged-in user

  useEffect(() => {
    axios.get('http://localhost:5000/api/profile')
      .then(res => {
        setAchievements(res.data.filter(a => a.userId === userId));
      });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, userId };
    const res = await axios.post('http://localhost:5000/api/profile/add', payload);
    setAchievements([...achievements, res.data.achievement]);
    setForm({ title: '', description: '', points: '', category: '', github: '', linkedin: '', certificate: '', visibility: 'public' });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>

      <h2 className="text-xl font-semibold mb-2">Add New Achievement</h2>
      <form className="mb-6 space-y-2" onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-2 rounded w-full" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description (max 300 chars)" maxLength={300} className="border p-2 rounded w-full" required />
        <input name="points" value={form.points} onChange={handleChange} placeholder="Points" type="number" className="border p-2 rounded w-full" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-2 rounded w-full" />
        <input name="github" value={form.github} onChange={handleChange} placeholder="GitHub Link" className="border p-2 rounded w-full" />
        <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn Link" className="border p-2 rounded w-full" />
        <input name="certificate" value={form.certificate} onChange={handleChange} placeholder="Certificate Link" className="border p-2 rounded w-full" />
        <select name="visibility" value={form.visibility} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Achievement</button>
      </form>

      <h2 className="text-xl font-semibold mb-2">My Achievements</h2>
      <ul className="space-y-2">
        {achievements.map(a => (
          <li key={a.id} className="border p-2 rounded shadow">
            <strong>{a.title}</strong> – {a.points} pts
            <p>{a.description}</p>
            {a.github && <a href={a.github} target="_blank">GitHub</a>}
            {a.linkedin && <a href={a.linkedin} target="_blank">LinkedIn</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}
