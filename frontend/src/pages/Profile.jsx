// src/pages/Profile.jsx
import React, { useState } from "react";

export default function Profile() {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    category: "",
    visibility: "public"
  });

  const handleAdd = () => {
    if (!newAchievement.title) return;
    setAchievements([
      ...achievements,
      { ...newAchievement, id: Date.now(), date: new Date().toISOString() }
    ]);
    setNewAchievement({ title: "", category: "", visibility: "public" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👤 My Profile</h1>

      {/* Add New Achievement */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New Achievement</h2>
        <input
          type="text"
          placeholder="Achievement Title"
          value={newAchievement.title}
          onChange={e => setNewAchievement({ ...newAchievement, title: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Category (AI, Web Dev, etc)"
          value={newAchievement.category}
          onChange={e => setNewAchievement({ ...newAchievement, category: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <select
          value={newAchievement.visibility}
          onChange={e => setNewAchievement({ ...newAchievement, visibility: e.target.value })}
          className="border p-2 w-full mb-2"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Achievement
        </button>
      </div>

      {/* List My Achievements */}
      <div>
        <h2 className="text-lg font-semibold mb-2">My Achievements</h2>
        {achievements.map(a => (
          <div key={a.id} className="p-3 border rounded mb-2 shadow">
            <p>{a.title}</p>
            <span className="text-sm text-gray-500">{a.category} • {a.visibility}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
