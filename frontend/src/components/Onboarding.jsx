import { useState } from "react";
import { onboard } from "../api";

const SUGGESTIONS = [
  "a confident public speaker",
  "someone who does deep, focused work",
  "a leader people trust",
  "a disciplined long-distance runner",
];

export default function Onboarding({ onDone }) {
  const [statement, setStatement] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    const trimmed = statement.trim();
    if (!trimmed) {
      setError("Type who you're trying to become first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const pillarNames = await onboard(trimmed); // POST /api/onboard -> { pillars: string[] }
      onDone(trimmed, pillarNames);
    } catch (e) {
      console.error(e);
      setError(
        e.code === "ERR_NETWORK"
          ? "Can't reach the backend. Is uvicorn running on " +
              (import.meta.env.VITE_API_URL || "http://localhost:8000") +
              "?"
          : "Something went wrong generating pillars — try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-24 pb-32">
      <p className="eyebrow">Step One</p>
      <h1 className="font-serif font-semibold text-[52px] leading-[1.06] mb-4.5 max-w-2xl">
        Who are you trying to become?
      </h1>
      <p className="text-inksoft text-[17px] leading-relaxed max-w-xl mb-8">
        One sentence is enough. Kairos will break it into 4–5 concrete, trackable pillars — and
        start closing the gap one well-timed nudge at a time.
      </p>

      <div className="flex gap-3.5 max-w-2xl mb-4.5">
        <input
          className="flex-1 px-6 py-5 rounded-pill border border-line bg-white text-base placeholder:text-inkfaint"
          placeholder="a confident public speaker"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
        />
        <button className="btn-primary whitespace-nowrap" onClick={generate} disabled={loading}>
          {loading ? "Thinking…" : "Generate my pillars"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5 max-w-2xl">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="chip" onClick={() => setStatement(s)}>
            {s}
          </button>
        ))}
      </div>

      {(loading || error) && (
        <p className={`mt-3 text-[12.5px] ${error ? "text-branddeep" : "text-inkfaint"}`}>
          {loading ? "Calling /api/onboard…" : error}
        </p>
      )}
    </div>
  );
}
