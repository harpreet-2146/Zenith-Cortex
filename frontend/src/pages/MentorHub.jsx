import React from "react";

export default function MentorHub() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Mentor Hub</h1>
      
      <p className="text-gray-700">
        Welcome to the Mentor Hub! This is your central dashboard to manage and guide your students.
      </p>

      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <h2 className="text-xl font-semibold">📝 Student Monitoring</h2>
        <p className="text-gray-600">
          Assign students under your mentorship and track their progress. You will be able to flag students who are falling behind and provide guidance to help them improve.
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <h2 className="text-xl font-semibold">🚩 Flags & Notifications</h2>
        <p className="text-gray-600">
          Mark and monitor students who need attention, send reminders, and manage alerts about their performance and milestones.
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-3">
        <h2 className="text-xl font-semibold">🎓 Hackathons & Opportunities</h2>
        <p className="text-gray-600">
          Post upcoming hackathons, workshops, internships, and other opportunities for your students. Help them gain exposure and enhance their skills.
        </p>
      </div>

      <div className="bg-yellow-100 p-4 rounded-lg shadow space-y-3">
        <h2 className="text-xl font-semibold">⚡ Coming Soon</h2>
        <p className="text-gray-700">
          Advanced analytics for student performance, AI-driven recommendations for mentorship, and seamless communication tools will be added soon.
        </p>
      </div>
    </div>
  );
}
