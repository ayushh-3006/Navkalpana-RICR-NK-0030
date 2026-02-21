import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  BrainCircuit,
  PieChart,
  Code,
  Mic,
  FileText,
  UploadCloud,
  Menu,
  X,
  LogOut,
  Zap,
} from "lucide-react";

export default function StudentDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Overview", path: ".", icon: <LayoutDashboard size={18} />, exact: true },
    { name: "Adaptive Quiz", path: "adaptive-quiz", icon: <BrainCircuit size={18} /> },
    { name: "Quiz History", path: "quiz-history", icon: <PieChart size={18} /> },
    { name: "Assignment", path: "assignment", icon: <Code size={18} /> },
    { name: "Interview Prep", path: "interview-prep", icon: <Mic size={18} /> },
    { name: "Resume Analysis", path: "resume-analysis", icon: <FileText size={18} /> },
    { name: "Resume Upload", path: "resume-upload", icon: <UploadCloud size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans flex pt-24 overflow-hidden relative">
      {/* ✅ overlay for mobile when sidebar open */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            aria-label="Close sidebar overlay"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: isOpen ? 256 : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#0a0a0a] border-r border-slate-800 flex flex-col fixed h-[calc(100vh-6rem)] z-40 overflow-hidden"
      >
        <div className="w-64 p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8 pl-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Student Menu
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.exact}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[inset_0_0_12px_rgba(6,182,212,0.06)]"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white border-transparent"
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* LOGOUT */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>

      {/* MAIN */}
      <motion.main
        animate={{ marginLeft: isOpen ? 256 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 p-6 lg:p-8 w-full relative z-10"
      >
        {/* Hamburger */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, x: -12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -12 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsOpen(true)}
              className="mb-5 flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-white shadow-lg group"
            >
              <Menu size={20} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold tracking-wide">Menu</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* ✅ Quick Actions (hackathon look) */}
        <div className="mb-5 flex flex-col md:flex-row gap-3">
          <button
            onClick={() => navigate("/student/dashboard/adaptive-quiz")}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-800 bg-black/20 text-slate-200 hover:bg-black/30 transition"
          >
            <Zap size={18} className="text-cyan-400" />
            Start Adaptive Quiz
          </button>

          <button
            onClick={() => navigate("/student/dashboard/quiz-history")}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-800 bg-black/20 text-slate-200 hover:bg-black/30 transition"
          >
            <PieChart size={18} className="text-cyan-400" />
            View History
          </button>

          <button
            onClick={() => navigate("/student/dashboard/resume-upload")}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-800 bg-black/20 text-slate-200 hover:bg-black/30 transition"
          >
            <UploadCloud size={18} className="text-cyan-400" />
            Upload Resume
          </button>
        </div>

        {/* Outlet */}
        <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl min-h-[80vh] p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}