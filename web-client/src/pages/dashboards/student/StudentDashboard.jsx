import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Code, 
  Mic, 
  PieChart, 
  FileText, 
  UploadCloud,
  Menu,
  X,
  LogOut // New icon imported
} from "lucide-react";

export default function StudentDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Overview", path: "/student/dashboard", icon: <LayoutDashboard size={18} />, exact: true },
    { name: "Adaptive Quiz", path: "adaptive-quiz", icon: <BrainCircuit size={18} /> },
    { name: "Assignment", path: "assignment", icon: <Code size={18} /> },
    { name: "Interview Prep", path: "interview-prep", icon: <Mic size={18} /> },
    { name: "Quiz Result", path: "quiz-result", icon: <PieChart size={18} /> },
    { name: "Resume Analysis", path: "resume-analysis", icon: <FileText size={18} /> },
    { name: "Resume Upload", path: "resume-upload", icon: <UploadCloud size={18} /> },
  ];

  // LOGOUT FUNCTION
  const handleLogout = () => {
    // 1. Clear local storage (Token & User data)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Note: Agar aap AuthContext use kar rahe hain, toh aap yahan useContext se logout() call kar sakte hain.

    // 2. Show Success Toast
    toast.success("Logged out successfully");

    // 3. Redirect to Login Page
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans flex pt-24 overflow-hidden">
      
      {/* ========================================== */}
      {/* 1. ANIMATED SIDEBAR                        */}
      {/* ========================================== */}
      <motion.aside 
        initial={{ width: 0, opacity: 0 }}
        animate={{ 
          width: isOpen ? 256 : 0, 
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.05)]"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent"
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* --- LOGOUT BUTTON (Pushed to bottom using mt-auto) --- */}
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

      {/* ========================================== */}
      {/* 2. MAIN CONTENT AREA                       */}
      {/* ========================================== */}
      <motion.main 
        animate={{ marginLeft: isOpen ? 256 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 p-6 lg:p-8 w-full"
      >
        
        {/* HAMBURGER TOGGLE BUTTON */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(true)}
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-white shadow-lg group"
            >
              <Menu size={20} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold tracking-wide">Menu</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* OUTLET CONTAINER */}
        <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl min-h-[80vh] p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          <Outlet />
        </div>

      </motion.main>

    </div>
  );
}