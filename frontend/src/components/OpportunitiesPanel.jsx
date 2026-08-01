import { useEffect, useState } from "react";
import { opportunities as fetchOpportunities } from "../api";

export default function OpportunitiesPanel({ statement, pillars }) {
  const [threshold, setThreshold] = useState(60);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      // POST /api/opportunities -> { opportunities: [...] }
      // Eligibility + pitch text both come back pre-computed from
      // fusion_engine.pick_eligible_opportunities + agent.generate_opportunity_pitch.
      const data = await fetchOpportunities(statement, pillars, threshold);
      setItems(data);
    } catch (e) {
      console.error(e);
      setError("Couldn't reach /api/opportunities — is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);

  return (
    <div className="pt-12">
      <div className="flex justify-between items-end flex-wrap gap-4 mb-7">
        <div>
          <p className="eyebrow">Unlocked</p>
          <h2 className="font-serif font-semibold text-[38px] leading-tight mb-1">
            Real-world opportunities
          </h2>
          <p className="text-inksoft text-[17px] max-w-lg">
            A pillar unlocks opportunities tagged to it once mastery crosses the threshold.
          </p>
        </div>
        <div className="text-right">
          <label className="text-[12.5px] text-inkfaint block mb-1.5">Mastery threshold</label>
          <input
            type="range"
            min="30"
            max="90"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />
          <div className="text-[12.5px] text-inkfaint mt-1">{threshold}</div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-inkfaint text-sm">
          <span className="spin" /> Checking eligibility…
        </div>
      )}

      {!loading && error && <div className="card p-6 text-branddeep">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="card p-12 text-center text-inkfaint">
          Nothing unlocked yet. Grow a pillar past <b className="text-inksoft">{threshold}</b>{" "}
          mastery to see opportunities open up here.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {items.map((o) => (
            <div key={o.id} className="card p-5.5 flex flex-col gap-2.5">
              <div className="text-[11px] uppercase tracking-wide text-branddeep font-bold">
                {o.type}
              </div>
              <div className="text-[17px] font-semibold leading-tight">{o.title}</div>
              {o.pitch && (
                <div className="font-serif italic text-[14px] text-inksoft leading-relaxed">
                  &ldquo;{o.pitch}&rdquo;
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(o.matched_pillars || []).map((t) => (
                  <span key={t} className="text-[11.5px] px-2.5 py-1 rounded-pill bg-cream2 text-inksoft">
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={o.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12.5px] text-inkfaint underline mt-1"
              >
                view opportunity ↗
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
