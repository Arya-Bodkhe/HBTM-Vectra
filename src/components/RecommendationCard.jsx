import { FaRocket } from "react-icons/fa";

export default function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;

  return (
    <div className="bg-gradient-to-r
    from-cyan-500
    to-indigo-600
    rounded-3xl
    p-8
    shadow-2xl">

      <div className="flex items-center gap-3">

        <FaRocket size={28} />

        <h2 className="text-2xl font-bold">
          Today's Mission
        </h2>

      </div>

      <h3 className="text-3xl mt-5 font-bold">
        {recommendation.pillar}
      </h3>

      <p className="mt-4 text-lg">
        {recommendation.content}
      </p>

      <div className="mt-6 bg-white/20 rounded-xl p-4">

        <strong>Why this?</strong>

        <p className="mt-2">
          {recommendation.rationale}
        </p>

      </div>

    </div>
  );
}