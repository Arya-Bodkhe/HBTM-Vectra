import { useEffect, useState } from "react";
import { recommend } from "../api";

const REC_LABELS = {
  just_in_time_deep: "Just-in-time deep resource",
  foundational_primer: "Foundational primer",
  stretch_expert: "Stretch / expert content",
  redirect_nudge: "Redirect nudge",
};

export default function TodaysPick({ pillars, driftDetected, setDriftDetected }) {
  const [moment, setMoment] = useState("");
  const [pick, setPick] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      // POST /api/recommend -> { pillar, recommendation_type, content, rationale }
      const data = await recommend(pillars, { userMoment: moment, driftDetected });
      setPick(data);
    } catch (e) {
      console.error(e);
      setError("Couldn't reach /api/recommend — is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  // Refresh once on mount / whenever the pillar set changes shape.
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pillars.length]);

  return (
    <div className="card p-8 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[radial-gradient(circle,#FBE7D7,transparent_70%)]" />

      <div className="relative">
        {loading && (
          <div className="flex items-center gap-2 text-inkfaint text-sm">
            <span className="spin" /> Choosing today's pick…
          </div>
        )}

        {!loading && error && <div className="text-branddeep text-sm">{error}</div>}

        {!loading && !error && pick && (
          <>
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <span className="bg-brandwash text-branddeep font-bold text-[11.5px] uppercase tracking-wide px-3 py-1.5 rounded-pill">
                {REC_LABELS[pick.recommendation_type] || pick.recommendation_type}
              </span>
              <span className="text-inkfaint text-[13.5px]">
                for <b className="text-inksoft">{pick.pillar}</b>
              </span>
            </div>

            <div className="font-serif text-2xl mb-2.5">{pick.content?.title}</div>
            <div className="text-inkfaint text-[13.5px] mb-4">
              {pick.content?.type}
              {pick.content?.length_minutes ? ` · ${pick.content.length_minutes} min` : ""}
              {pick.content?.url && (
                <>
                  {" · "}
                  <a
                    href={pick.content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    open resource ↗
                  </a>
                </>
              )}
            </div>

            <p className="font-serif italic text-lg leading-relaxed border-l-[3px] border-brand pl-4 my-4.5">
              &ldquo;{pick.rationale}&rdquo;
            </p>
          </>
        )}

        <div className="flex flex-wrap gap-3 items-center mt-5 pt-5 border-t border-line">
          <input
            className="flex-1 min-w-[220px] px-4 py-2.5 rounded-pill border border-line text-sm"
            placeholder='Got a near-term moment? e.g. "talk on Friday"'
            value={moment}
            onChange={(e) => setMoment(e.target.value)}
          />
          <label className="flex items-center gap-2 text-[13.5px] text-inksoft cursor-pointer select-none">
            <input
              type="checkbox"
              checked={driftDetected}
              onChange={(e) => setDriftDetected(e.target.checked)}
            />
            I've been scrolling
          </label>
          <button className="btn-ghost btn-sm" onClick={refresh}>
            Refresh recommendation
          </button>
        </div>
      </div>
    </div>
  );
}
