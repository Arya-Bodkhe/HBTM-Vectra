import { motion } from "framer-motion";
import { FaBullseye } from "react-icons/fa";

export default function PillarCard({ pillar }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur-xl
      border border-white/20
      rounded-3xl
      shadow-2xl
      p-6"
    >
      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-bold text-white">
            {pillar.name}
          </h2>

          <p className="text-gray-300 mt-1">
            Mastery Progress
          </p>
        </div>

        <FaBullseye
          className="text-cyan-400"
          size={26}
        />

      </div>

      <div className="mt-6">

        <div className="flex justify-between mb-2">

          <span className="text-gray-300">
            Progress
          </span>

          <span className="font-bold text-cyan-400">
            {pillar.mastery_score}%
          </span>

        </div>

        <div className="w-full h-3 rounded-full bg-white/20">

          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${pillar.mastery_score}%`,
            }}
            transition={{ duration: 1 }}
            className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
          />

        </div>

      </div>

      <div className="mt-6 flex justify-between">

        <span className="text-gray-300">
          Priority
        </span>

        <span className="text-emerald-400 font-bold">
          {pillar.priority_weight}
        </span>

      </div>

    </motion.div>
  );
}