import { useState } from "react";
import { twinMessage } from "../api";

export default function TwinChat({ futureSelfStatement, pillars }) {
  const [messages, setMessages] = useState([
    { from: "twin", text: "I'm here whenever you want to check in. Ask me anything." },
  ]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const weakest = pillars.length
    ? pillars.reduce((a, b) => (a.mastery_score <= b.mastery_score ? a : b))
    : null;

  async function askFutureSelf() {
    const trimmedNote = note.trim();
    if (trimmedNote) setMessages((prev) => [...prev, { from: "user", text: trimmedNote }]);
    setLoading(true);
    setError("");
    try {
      // POST /api/twin-message -> { message }
      const message = await twinMessage(futureSelfStatement, pillars, trimmedNote || null);
      setMessages((prev) => [...prev, { from: "twin", text: message }]);
      setNote("");
    } catch (e) {
      console.error(e);
      setError("Couldn't reach /api/twin-message — is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-12">
      <p className="eyebrow">Digital Twin</p>
      <h2 className="font-serif font-semibold text-[38px] leading-tight mb-2">
        Ask your future self
      </h2>
      <p className="text-inksoft text-[17px] leading-relaxed max-w-xl mb-6">
        Grounded in your own stated aspiration and your live pillar data — not a static persona.
      </p>

      <div className="card max-w-xl overflow-hidden">
        <div className="p-6 border-b border-line flex items-center gap-3">
          <div className="w-8.5 h-8.5 rounded-full flex-none bg-[conic-gradient(from_200deg,#E56B32,#A9835B,#E56B32)]" />
          <div>
            <div className="font-semibold">The {futureSelfStatement || "future you"}</div>
            <div className="text-[12.5px] text-inkfaint">
              {weakest ? `Currently focused on ${weakest.name}` : "—"}
            </div>
          </div>
        </div>

        <div className="p-5.5 flex flex-col gap-3.5 min-h-[120px] max-h-[380px] overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.from === "user"
                  ? "self-end bg-brandwash rounded-[16px_16px_4px_16px] px-4.5 py-3 text-[14.5px] text-inksoft max-w-[88%]"
                  : "bg-cream2 rounded-[16px_16px_16px_4px] px-4.5 py-3.5 font-serif text-[16.5px] leading-relaxed max-w-[88%]"
              }
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="bg-cream2 rounded-[16px_16px_16px_4px] px-4.5 py-3.5 flex items-center gap-2 text-inkfaint text-sm">
              <span className="spin" /> thinking…
            </div>
          )}
        </div>

        <div className="p-4.5 border-t border-line flex gap-2.5">
          <input
            className="flex-1 px-4 py-3 rounded-pill border border-line text-sm"
            placeholder="Optional — tell me what's going on..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askFutureSelf()}
          />
          <button className="btn-primary btn-sm" onClick={askFutureSelf} disabled={loading}>
            Ask
          </button>
        </div>
      </div>
      {error && <p className="text-branddeep text-[12.5px] mt-3">{error}</p>}
    </div>
  );
}
