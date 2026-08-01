import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Onboarding from "./components/Onboarding";
import PillarCard from "./components/PillarCard";
import TodaysPick from "./components/TodaysPick";
import JournalPanel from "./components/JournalPanel";
import OpportunitiesPanel from "./components/OpportunitiesPanel";
import TwinChat from "./components/TwinChat";
import GrowthTimeline from "./components/GrowthTimeline";

const LS_KEY = "kairos.state.v1";

function loadSaved() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* ignore corrupt storage */
  }
  return null;
}

function newId() {
  return crypto.randomUUID ? crypto.randomUUID() : "id_" + Math.random().toString(36).slice(2);
}

export default function App() {
  const saved = loadSaved();
  const [tab, setTab] = useState(saved?.pillars?.length ? "dashboard" : "onboard");
  const [statement, setStatement] = useState(saved?.statement || "");
  const [pillars, setPillars] = useState(saved?.pillars || []);
  const [localHistory, setLocalHistory] = useState(saved?.localHistory || []);
  const [userId] = useState(saved?.userId || newId());
  const [driftDetected, setDriftDetected] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ statement, pillars, localHistory, userId })
    );
  }, [statement, pillars, localHistory, userId]);

  function handleOnboardDone(newStatement, pillarNames) {
    const now = new Date().toISOString();
    const newPillars = pillarNames.map((name) => ({
      id: newId(),
      name: String(name),
      mastery_score: 20,
      priority_weight: 2,
    }));
    setStatement(newStatement);
    setPillars(newPillars);
    setLocalHistory(newPillars.map((p) => ({ pillar_name: p.name, score: 20, recorded_at: now })));
    setTab("dashboard");
  }

  function setPriority(id, weight) {
    setPillars((prev) => prev.map((p) => (p.id === id ? { ...p, priority_weight: weight } : p)));
  }

  function applyDeltas(deltas) {
    const now = new Date().toISOString();
    const newHistoryPoints = [];
    setPillars((prev) =>
      prev.map((p) => {
        const delta = deltas[p.name];
        if (delta === undefined) return p;
        const clamped = Math.max(-5, Math.min(10, Math.round(Number(delta))));
        const newScore = Math.max(0, Math.min(100, p.mastery_score + clamped));
        newHistoryPoints.push({ pillar_name: p.name, score: newScore, recorded_at: now });
        return { ...p, mastery_score: newScore };
      })
    );
    setLocalHistory((prev) => [...prev, ...newHistoryPoints]);
  }

  const unlocked = pillars.length > 0;

  return (
    <>
      <NavBar tab={tab} setTab={setTab} unlocked={unlocked} />
      <main className="max-w-[1080px] mx-auto px-8">
        {tab === "onboard" && <Onboarding onDone={handleOnboardDone} />}

        {tab === "dashboard" && unlocked && (
          <div className="pb-24">
            <div className="pt-12">
              <p className="eyebrow">Becoming</p>
              <h2 className="font-serif font-semibold text-[30px] leading-tight mb-1.5">
                "{statement}"
              </h2>
              <p className="text-inksoft text-[15px] mb-2">
                Your pillars, and today's one reasoned recommendation.
              </p>
            </div>

            <div className="mt-6">
              <TodaysPick
                pillars={pillars}
                driftDetected={driftDetected}
                setDriftDetected={setDriftDetected}
              />
            </div>

            <div className="flex items-end justify-between mt-14 mb-6.5 flex-wrap gap-5">
              <h2 className="font-serif font-semibold text-[30px] m-0">Your pillars</h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
              {pillars.map((p) => (
                <PillarCard key={p.id} pillar={p} onPriorityChange={setPriority} />
              ))}
            </div>
          </div>
        )}

        {tab === "journal" && unlocked && (
          <div className="pb-24">
            <JournalPanel pillars={pillars} onDeltas={applyDeltas} />
          </div>
        )}

        {tab === "opportunities" && unlocked && (
          <div className="pb-24">
            <OpportunitiesPanel statement={statement} pillars={pillars} />
          </div>
        )}

        {tab === "future" && unlocked && (
          <div className="pb-24">
            <TwinChat futureSelfStatement={statement} pillars={pillars} />
          </div>
        )}

        {tab === "timeline" && unlocked && (
          <div className="pb-24">
            <GrowthTimeline userId={userId} localHistory={localHistory} />
          </div>
        )}

        {tab === "about" && (
          <div className="pt-12 pb-24 max-w-2xl">
            <p className="eyebrow">Kairos (καιρός) — the right moment</p>
            <h2 className="font-serif font-semibold text-[42px] leading-tight mb-4">
              Not a feed. A gap-closer.
            </h2>
            <p className="text-inksoft text-[17px] leading-relaxed mb-8">
              Most tools recommend by similarity — a search box wearing an AI costume. Kairos
              scores the distance between who you say you're trying to become and what you
              actually do, then closes it one reasoned, well-timed recommendation at a time. When
              you drift toward passive consumption, it notices and redirects instead of feeding
              the drift.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {[
                ["Frontend", "Onboarding, dashboard, journal, future-self chat, growth timeline — Garima."],
                ["Backend Core", "FastAPI + Supabase identity graph and mastery history — Srushti."],
                ["Agent Service", "The reasoning layer and the gap × urgency decision table — Arya."],
                ["Content", "Hand-curated, pillar-tagged resources across five domains — Janhavi."],
              ].map(([who, what]) => (
                <div key={who} className="card p-5">
                  <div className="text-[13px] font-bold text-branddeep uppercase tracking-wide mb-2">
                    {who}
                  </div>
                  <div className="text-[14px] text-inksoft leading-relaxed">{what}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
