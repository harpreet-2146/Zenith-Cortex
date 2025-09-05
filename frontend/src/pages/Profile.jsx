import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    domain: "Project",
    proofLink: "",
  });

  // Fetch achievements on load
  useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await axios.get("http://localhost:5000/api/achievements");
        const myAchievements = res.data.filter((a) => a.studentId === user.id);
        setAchievements(myAchievements);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAchievements();
  }, [user.id]);

  // Dummy points calculation
  const calculatePoints = (title, domain, description) => {
    const lengthScore = Math.min(description.length / 50, 20); // longer description → more points
    let domainScore = 0;
    switch (domain) {
      case "Project":
        domainScore = 20;
        break;
      case "Hackathon":
        domainScore = 25;
        break;
      case "Research Paper":
        domainScore = 30;
        break;
      case "Internship":
        domainScore = 15;
        break;
      case "Course":
        domainScore = 10;
        break;
      case "Patent":
        domainScore = 35;
        break;
      default:
        domainScore = 10;
    }
    return Math.round(domainScore + lengthScore);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const points = calculatePoints(form.title, form.domain, form.description);

    const newAchievement = {
      studentId: user.id,
      title: form.title,
      description: form.description,
      domain: form.domain,
      proofLink: form.proofLink,
      points,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/achievements",
        newAchievement
      );
      setAchievements([...achievements, res.data]);
      setForm({ title: "", description: "", domain: "Project", proofLink: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const totalPoints = achievements.reduce((acc, a) => acc + a.points, 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{user.name}'s Profile</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-6 space-y-1">
        <p><strong>SRN:</strong> {user.srn}</p>
        <p><strong>Class:</strong> {user.class}</p>
        <p><strong>Year:</strong> {user.year}</p>
        <p><strong>Department:</strong> {user.department}</p>
        <p><strong>Branch:</strong> {user.branch}</p>
        <p><strong>Total Points:</strong> {totalPoints}</p>
      </div>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold mb-4">Add Achievement</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <textarea
          name="description"
          placeholder="Description (max 1000 chars)"
          value={form.description}
          onChange={handleChange}
          maxLength={1000}
          required
          className="border p-2 w-full"
        />
        <select
          name="domain"
          value={form.domain}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option>Project</option>
          <option>Hackathon</option>
          <option>Research Paper</option>
          <option>Internship</option>
          <option>Course</option>
          <option>Patent</option>
        </select>
        <input
          type="text"
          name="proofLink"
          placeholder="GitHub / LinkedIn / Vercel / Certificate Link"
          value={form.proofLink}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Achievement
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">My Achievements</h2>
      {achievements.length === 0 ? (
        <p>No achievements added yet.</p>
      ) : (
        <ul className="space-y-3">
          {achievements.map((a) => (
            <li key={a.id} className="border p-3 rounded">
              <p><strong>{a.title}</strong> ({a.domain}) - {a.points} pts</p>
              <p>{a.description}</p>
              <p className="text-blue-600 underline">{a.proofLink}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
