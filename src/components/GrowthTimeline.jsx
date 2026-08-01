import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const COLORS = [
  "#4f46e5",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
];

export default function GrowthTimeline({ userId }) {
  const [data, setData] = useState([]);
  const [pillarNames, setPillarNames] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await axios.get(`${API}/api/timeline`, {
        params: { user_id: userId },
      });

      const byTime = {};
      const names = new Set();

      for (const p of res.data.points) {
        names.add(p.pillar_name);

        byTime[p.recorded_at] =
          byTime[p.recorded_at] || {
            recorded_at: p.recorded_at,
          };

        byTime[p.recorded_at][p.pillar_name] = p.score;
      }

      setPillarNames([...names]);

      setData(
        Object.values(byTime).sort((a, b) =>
          a.recorded_at.localeCompare(b.recorded_at)
        )
      );
    }

    if (userId) load();
  }, [userId]);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">
  📈 Growth Journey
</h2>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="recorded_at"
            tick={{ fontSize: 11 }}
          />

          <YAxis domain={[0, 100]} />

          <Tooltip />

          <Legend />

          {pillarNames.map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={COLORS[i % COLORS.length]}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}