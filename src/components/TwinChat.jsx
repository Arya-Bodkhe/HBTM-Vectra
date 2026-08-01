import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaRobot, FaUser } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function TwinChat({ futureSelfStatement, pillars }) {
  const [messages, setMessages] = useState([
    {
      from: "twin",
      text: "Hi! I'm your future self. Ask me anything about your journey.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  async function askFutureSelf() {
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/twin-message`, {
        future_self_statement: futureSelfStatement,
        pillars,
      });

      setMessages((prev) => [
        ...prev,
        {
          from: "user",
          text: "Give me today's advice.",
        },
        {
          from: "twin",
          text: res.data.message,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: "user",
          text: "Give me today's advice.",
        },
        {
          from: "twin",
          text:
            "Keep practicing your weakest pillar today. Small improvements compound into mastery.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">

      <div className="flex items-center gap-3 mb-5">
        <FaRobot className="text-cyan-400" size={26} />
        <h2 className="text-2xl font-bold text-white">
          Future Self AI
        </h2>
      </div>

      <div className="space-y-4 h-80 overflow-y-auto">

        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              msg.from === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-md rounded-2xl px-4 py-3 ${
                msg.from === "user"
                  ? "bg-cyan-500 text-white"
                  : "bg-white/20 text-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {msg.from === "user" ? (
                  <FaUser />
                ) : (
                  <FaRobot />
                )}

                <span className="font-semibold">
                  {msg.from === "user"
                    ? "You"
                    : "Future Self"}
                </span>
              </div>

              {msg.text}
            </div>
          </motion.div>
        ))}

      </div>

      <button
        onClick={askFutureSelf}
        disabled={loading}
        className="mt-6 w-full bg-cyan-500 hover:bg-cyan-400 rounded-xl py-3 font-bold"
      >
        {loading
          ? "Thinking..."
          : "Ask My Future Self"}
      </button>

    </div>
  );
}