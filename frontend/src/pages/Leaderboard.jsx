import { useMemo, useState } from "react";
import raw from "../data/students.mock.json";
import { scoreUser } from "../utils/score";

export default function Leaderboard() {
  const [dept, setDept] = useState("all");
  const [range, setRange] = useState("6m");

  const scored = useMemo(() => {
    let list = raw;
    if (dept !== "all") list = list.filter(s => s.dept === dept);
    return list
      .map(u => ({ ...u, metrics: scoreUser(u, range) }))
      .sort((a,b) => b.metrics.total - a.metrics.total);
  }, [dept, range]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>

      <div className="flex gap-3 mb-4">
        <select className="border rounded p-2" value={dept} onChange={(e)=>setDept(e.target.value)}>
          <option value="all">All Departments</option>
          <option value="CSE">CSE</option><option value="ECE">ECE</option>
          <option value="ME">ME</option><option value="DESIGN">DESIGN</option>
        </select>
        <select className="border rounded p-2" value={range} onChange={(e)=>setRange(e.target.value)}>
          <option value="1m">Last 1 month</option>
          <option value="6m">Last 6 months</option>
          <option value="1y">Last 1 year</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="text-left bg-gray-50">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Student</th>
              <th className="p-3">Dept</th>
              <th className="p-3">Projects</th>
              <th className="p-3">Skills</th>
              <th className="p-3">Endorse</th>
              <th className="p-3">ATS</th>
              <th className="p-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {scored.map((s, i) => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-semibold">{i+1}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.dept}</td>
                <td className="p-3">{s.metrics.projPts}</td>
                <td className="p-3">{s.metrics.skillPts}</td>
                <td className="p-3">{s.metrics.endorsements}</td>
                <td className="p-3">{s.metrics.ats}</td>
                <td className="p-3 font-bold">{s.metrics.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

