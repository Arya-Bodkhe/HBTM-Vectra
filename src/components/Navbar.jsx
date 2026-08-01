import { FaRobot } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-10 py-5">
      <div className="flex items-center gap-3">
        <FaRobot size={28} className="text-cyan-400" />

        <div>
          <h1 className="text-2xl font-bold">
            Kairos
          </h1>

          <p className="text-sm text-gray-300">
            Become your future self
          </p>
        </div>
      </div>

      <div className="flex gap-6 text-gray-300">
        <span>Dashboard</span>
        <span>Journal</span>
        <span>Timeline</span>
      </div>
    </nav>
  );
}