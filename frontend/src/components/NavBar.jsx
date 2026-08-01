const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "opportunities", label: "Opportunities" },
  { id: "journal", label: "Journal" },
  { id: "future", label: "Future Self" },
  { id: "timeline", label: "Timeline" },
  { id: "about", label: "About" },
];

export default function NavBar({ tab, setTab, unlocked }) {
  return (
    <nav className="sticky top-0 z-40 bg-cream/85 backdrop-blur-md border-b border-line">
      <div className="max-w-[1080px] mx-auto px-8 py-4.5 flex items-center justify-between gap-6">
        <button
          className="flex items-center gap-2 text-xl font-semibold font-serif bg-transparent border-none cursor-pointer"
          onClick={() => setTab(unlocked ? "dashboard" : "onboard")}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-brand shadow-[0_0_0_4px_#FBE7D7]" />
          Kairos
        </button>

        <div className="hidden md:flex gap-1.5 items-center">
          {TABS.map((t) => (
            <button
              key={t.id}
              disabled={!unlocked}
              onClick={() => setTab(t.id)}
              className={`px-3.5 py-2 rounded-pill text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                tab === t.id
                  ? "bg-white text-ink font-semibold shadow-card"
                  : "text-inksoft hover:bg-cream2 hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          className="bg-brand text-white border-none px-5.5 py-2.5 rounded-pill font-bold text-sm cursor-pointer shadow-[0_8px_20px_-8px_rgba(229,107,50,0.65)] hover:bg-branddeep transition-colors"
          onClick={() => setTab("onboard")}
        >
          Begin
        </button>
      </div>
    </nav>
  );
}
