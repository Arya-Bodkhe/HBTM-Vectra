import { useState } from "react";
import { journal } from "../api";

export default function JournalPanel({ pillars, onDeltas }) {
  const [text, setText] = useState("");
  const [deltas, setDeltas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function reflect() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    try {
      // POST /api/journal { text, pillar_names } -> { mastery_deltas }
      // pillar_ids is intentionally omitted — see README: without a
      // create-pillar endpoint on the backend there's no Supabase UUID to
      // send, so main.py skips the Supabase write and just returns the
      // deltas, which we apply to local pillar state instead.
      const result = await journal(
        trimmed,
        pillars.map((p) => p.name)
      );
      setDeltas(result);
      onDeltas(result);
      setText("");
    } catch (e) {
      console.error(e);
      setError("Couldn't reach /api/journal — is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-12">
      <p className="eyebrow">Reflect</p>
      <h2 className="font-serif font-semibold text-[38px] leading-tight mb-2">
        What did you just do?
      </h2>
      <p className="text-inksoft text-[17px] leading-relaxed max-w-xl mb-6">
        Write a real reflection. Kairos reads it, decides which pillars it touched, and moves
        their mastery live.
      </p>

      <div className="card p-6">
        <textarea
          className="w-full min-h-[150px] p-5 rounded-2xl border border-line text-[15.5px] resize-y"
          placeholder="e.g. Gave a 5-minute update at standup today and didn't lose my train of thought once, even when the PM interrupted with a question I hadn't prepared for..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-[12.5px] text-inkfaint">Deltas run from −5 to +10 per pillar.</span>
          <button className="btn-primary" onClick={reflect} disabled={loading}>
            {loading ? "Reflecting…" : "Reflect"}
          </button>
        </div>

        {error && <p className="text-branddeep text-[12.5px] mt-3">{error}</p>}

        {deltas && (
          <div className="flex flex-wrap gap-2.5 mt-4.5">
            {Object.entries(deltas).map(([name, delta]) => (
              <span
                key={name}
                className={`px-4 py-2 rounded-pill text-[13.5px] font-semibold border ${
                  delta >= 0
                    ? "bg-[#ECF2E9] border-[#CFE0C9] text-good"
                    : "bg-[#F7E9E4] border-[#EAC9BC] text-branddeep"
                }`}
              >
                {name} {delta >= 0 ? "+" : ""}
                {delta}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
