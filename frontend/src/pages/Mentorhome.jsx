import React from "react";

export default function MentorHome() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Mentor Dashboard</h1>
      <p>Welcome, Mentor! From here you can:</p>

      <ul className="list-disc ml-6 mt-3 space-y-2">
        <li>Assign students to monitor and track their progress.</li>
        <li>Flag students who are not making progress.</li>
        <li>Post hackathons, workshops, and other college opportunities.</li>
        <li>View leaderboard and mentor profile (logout).</li>
      </ul>
    </div>
  );
}
