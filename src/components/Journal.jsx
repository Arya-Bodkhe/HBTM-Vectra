import { useState } from "react";

export default function Journal() {
  const [text, setText] = useState("");

  return (
    <div className="bg-white/10
        backdrop-blur-xl
        border border-white/20
        rounded-3xl
        shadow-2xl
        p-8">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">
        Daily Reflection
      </h2>

      <textarea
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What did you accomplish today?"
        className="w-full
            bg-white/10
            border border-white/20
            rounded-xl
            p-4
            text-white
            placeholder:text-gray-400"
      />

      <button
        className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Save Reflection
      </button>
    </div>
  );
}