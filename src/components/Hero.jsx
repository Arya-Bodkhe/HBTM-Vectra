import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-6xl rounded-3xl
      bg-white/10 backdrop-blur-xl
      border border-white/20
      shadow-2xl
      p-12 mt-6"
    >
      <p className="text-cyan-400 font-semibold uppercase tracking-widest">
        AI Personal Growth Coach
      </p>

      <h1 className="text-5xl font-extrabold mt-4 leading-tight">
        Become the person your
        <br />
        <span className="text-cyan-400">
          future self already believes
        </span>
        <br />
        you can become.
      </h1>

      <p className="mt-6 text-lg text-gray-300 max-w-2xl">
        Kairos transforms your long-term aspirations into daily
        actions, tracks your progress, and lets you converse with
        your future self through AI.
      </p>
    </motion.div>
  );
}