import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Journal from "./components/Journal";
import RecommendationCard from "./components/RecommendationCard";
import { useState } from "react";
import axios from "axios";
import TwinChat from "./components/TwinChat";
import GrowthTimeline from "./components/GrowthTimeline";
import PillarCard from "./components/PillarCard";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function getRecommendation(pillars, moment, drift) {
  try {
    const res = await axios.post(`${API}/api/recommend`, {
      pillars,
      user_moment: moment,
      drift_detected: drift,
    });

    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default function App() {
  const [pillars, setPillars] = useState([]);
  const [statement, setStatement] = useState("");
  const [rec, setRec] = useState({
  pillar: "Storytelling",
  recommendation_type: "Deep Practice",
  content: "Watch a TED Talk and summarize it in your own words.",
  rationale: "Your storytelling mastery is currently the lowest.",
});
  // Temporary mock data until backend is ready
  async function onboard() {
    setPillars([
      {
        name: "Storytelling",
        mastery_score: 20,
        priority_weight: 2,
      },
      {
        name: "Voice Control",
        mastery_score: 35,
        priority_weight: 2,
      },
      {
        name: "Stage Presence",
        mastery_score: 15,
        priority_weight: 3,
      },
      {
        name: "Handling Q&A",
        mastery_score: 25,
        priority_weight: 2,
      },
    ]);
  }

  async function journal(text) {
    try {
      const res = await axios.post(`${API}/api/journal`, {
        text,
        pillar_names: pillars.map((p) => p.name),
      });

      return res.data.mastery_deltas;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  return (
    
    <main className="min-h-screen flex flex-col items-center px-6 pb-20">
        <Navbar />
      <Hero />

      <div className="w-full max-w-4xl mt-8 flex flex-col md:flex-row gap-4">

  <input
    value={statement}
    onChange={(e) => setStatement(e.target.value)}
    placeholder="Describe your future self..."
    className="flex-1 rounded-xl
    bg-white/10
    border border-white/20
    backdrop-blur-xl
    text-white
    px-6 py-4
    placeholder:text-gray-400
    outline-none"
  />

  <button
    onClick={onboard}
    className="px-8 py-4 rounded-xl
    bg-cyan-500
    hover:bg-cyan-400
    transition
    font-bold"
  >
    Generate My Pillars
  </button>

</div>

{pillars.length > 0 && (
  <div className="w-full max-w-7xl flex flex-col gap-10 mt-10">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {pillars.map((pillar) => (
        <PillarCard
          key={pillar.name}
          pillar={pillar}
        />
      ))}
    </div>

    <RecommendationCard recommendation={rec} />

<Journal />

<GrowthTimeline userId="demo-user" />

<TwinChat
  futureSelfStatement={statement}
  pillars={pillars}
/>
  </div>
)}
    <Footer />
    </main>
  );
}