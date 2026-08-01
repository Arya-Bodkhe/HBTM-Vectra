function Ring({ score, size = 56 }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  return (
    <div className="relative flex-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F5EDE0" strokeWidth="6" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E56B32"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold">
        {score}
      </div>
    </div>
  );
}

export default function PillarCard({ pillar, onPriorityChange }) {
  return (
    <div className="card p-5.5 flex flex-col gap-3.5">
      <div className="flex items-center gap-3.5">
        <Ring score={pillar.mastery_score} />
        <div>
          <div className="font-semibold text-[15.5px] leading-tight">{pillar.name}</div>
          <div className="text-inkfaint text-xs mt-0.5">mastery {pillar.mastery_score}/100</div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <label className="text-[11px] text-inkfaint uppercase tracking-wide">Priority</label>
        <div className="flex gap-1">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => onPriorityChange(pillar.id, n)}
              className={`w-6.5 h-6.5 rounded-lg border text-xs font-bold ${
                pillar.priority_weight === n
                  ? "bg-brand text-white border-brand"
                  : "bg-cream text-inksoft border-line"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
