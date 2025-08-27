// src/pages/Leaderboard.jsx
import React, { useState } from "react";
import achievementsData from "../data/achievements";
import { AnimatePresence } from "framer-motion";

export default function Leaderboard() {
  const [selectedYear, setSelectedYear] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const isInRange = (dateStr, range) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);

    switch (range) {
      case "present": return diffDays <= 7;
      case "1month": return diffDays <= 30;
      case "6months": return diffDays <= 180;
      case "1year": return diffDays <= 365;
      default: return true;
    }
  };

  // Filter achievements based on selectedYear and timeRange
  const filteredAchievements = achievementsData.filter(
    (a) => (selectedYear === "all" || a.year === parseInt(selectedYear)) &&
           isInRange(a.date, timeRange)
  );

  // Aggregate points and achievements per student
  const students = filteredAchievements.reduce((acc, a) => {
    if (!acc[a.name]) {
      acc[a.name] = {
        id: a.id,
        name: a.name,
        year: a.year,
        points: 0,
        achievements: [],
      };
    }
    acc[a.name].points += a.points;
    acc[a.name].achievements.push(a);
    return acc;
  }, {});

  const ranked = Object.values(students).sort((a, b) => b.points - a.points);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Years</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Time</option>
          <option value="present">This Week</option>
          <option value="1month">Last 1 Month</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last 1 Year</option>
        </select>
      </div>

      {/* Leaderboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ranked.map((s, idx) => (
          <motion.div
            key={s.name}
            layout
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedProfile(s)}
            className="cursor-pointer bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center"
          >
            <div className="text-2xl font-bold">#{idx + 1}</div>
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold">
              {s.name[0]}
            </div>
            <div className="mt-2 text-lg font-semibold">{s.name}</div>
            <div className="text-gray-600">Year {s.year}</div>
            <div className="mt-2 text-xl font-bold text-blue-600">
              {s.points} pts
            </div>
          </motion.div>
        ))}
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl max-w-lg w-full shadow-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-4">
                {selectedProfile.name} – Year {selectedProfile.year}
              </h2>
              <p className="mb-4 text-lg font-semibold">
                Total Points: {selectedProfile.points}
              </p>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {selectedProfile.achievements.map((a) => (
                  <li
                    key={a.project}
                    className="border p-2 rounded-lg shadow-sm"
                  >
                    <strong>{a.project}</strong> – {a.points} pts
                    <br />
                    <span className="text-sm text-gray-500">
                      {new Date(a.date).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedProfile(null)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
