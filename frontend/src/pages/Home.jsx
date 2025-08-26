// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import achievementsData from "../data/achievements.json";

export default function Home() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    setAchievements(achievementsData.filter(a => a.visibility === "public"));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎉 Achievements Feed</h1>
      {achievements.map(a => (
        <div key={a.id} className="p-4 border rounded-lg mb-3 shadow">
          <p className="font-semibold">{a.name} (Year {a.year})</p>
          <p>{a.title}</p>
          <span className="text-sm text-gray-500">{a.category}</span>
        </div>
      ))}
    </div>
  );
}
