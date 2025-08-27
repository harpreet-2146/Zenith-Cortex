import React, { useState, useEffect } from "react";
import achievementsData from "../data/achievements";   // ✅ default import

export default function Home() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    // no "visibility" field in your sample data, so just use all
    setAchievements(achievementsData);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎉 Achievements Feed</h1>
      {achievements.map((a) => (
        <div key={a.id} className="p-4 border rounded-lg mb-3 shadow">
          <p className="font-semibold">{a.name} (Year {a.year})</p>
          <p>{a.project}</p>
          <span className="text-sm text-gray-500">Points: {a.points}</span>
        </div>
      ))}
    </div>
  );
}
