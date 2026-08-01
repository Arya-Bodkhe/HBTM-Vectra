import { useEffect, useState } from "react";
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
import { timeline } from "../api";

const COLORS = ["#E56B32", "#5C7A5A", "#A9835B", "#8B6BAE", "#3E7C9A", "#B5533E"];

// Reshape [{ pillar_name, score, recorded_at }] into one row per timestamp,
// one column per pillar — same shape the build guide's GrowthTimeline.jsx uses.
function reshape(points) {
  const byTime = {};
  const names = new Set();
  for (const p of points) {
    names.add(p.pillar_name);
    byTime[p.recorded_at] = byTime[p.recorded_at] || { recorded_at: p.recorded_at };
    byTime[p.recorded_at][p.pillar_name] = p.score;
  }
  const rows = Object.values(byTime).sort((a, b) => a.recorded_at.localeCompare(b.recorded_at));
  return { rows, names: [...names] };
}

export default function GrowthTimeline({ userId, localHistory }) {
  const [rows, setRows] = useState([]);
  const [pillarNames, setPillarNames] = useState([]);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // GET /api/timeline?user_id=... -> { points }
        const points = await timeline(userId);
        if (cancelled) return;
        if (points && points.length) {
          const { rows, names } = reshape(points);
          setRows(rows);
          setPillarNames(names);
          setUsingFallback(false);
        } else {
          // Backend has no create-user/create-pillar endpoint yet, so a
          // brand-new user_id has no Supabase rows to join against and
          // /api/timeline correctly comes back empty. Fall back to the
          // client-side log built from journal responses so the chart
          // still shows real, un-invented data. See README.
          const { rows, names } = reshape(localHistory);
          setRows(rows);
          setPillarNames(names);
          setUsingFallback(true);
        }
      } catch (e) {
        console.error(e);
        const { rows, names } = reshape(localHistory);
        setRows(rows);
        setPillarNames(names);
        setUsingFallback(true);
      }
    }
    if (userId) load();
    return () => {
      cancelled = true;
    };
  }, [userId, localHistory]);

  return (
    <div className="pt-12">
      <p className="eyebrow">Growth</p>
      <h2 className="font-serif font-semibold text-[38px] leading-tight mb-2">
        The receipt, not just the claim
      </h2>
      <p className="text-inksoft text-[17px] leading-relaxed max-w-xl mb-6">
        Every journal entry writes to this chart. Nothing here is invented — it's a view onto the
        mastery deltas Kairos already computed.
      </p>

      <div className="card p-6">
        {rows.length === 0 ? (
          <div className="text-inkfaint text-sm py-16 text-center">
            No history yet — reflect in the Journal to see this move.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7DDCB" />
              <XAxis dataKey="recorded_at" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {pillarNames.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLORS[i % COLORS.length]}
                  dot={{ r: 3 }}
                  strokeWidth={2.5}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
        {usingFallback && rows.length > 0 && (
          <p className="text-[12px] text-inkfaint mt-3">
            Showing your local session log — /api/timeline has no Supabase rows for this user yet.
          </p>
        )}
      </div>
    </div>
  );
}
