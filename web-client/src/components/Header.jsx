import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Menu, X, Sparkles, Github, LogIn, Lock } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/student/dashboard' },
  { name: 'Practice', path: '/student/dashboard/adaptive-quiz' },
  { name: 'Resume AI', path: '/student/dashboard/resume-upload' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  
  // New state for showing the Login Popup Modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handler to check authentication before navigating
  const handleProtectedNavigation = (e, path) => {
    e.preventDefault();
    
    // Check if user is logged in (Assuming token is saved in localStorage)
    // You can also use your AuthContext here if you prefer
    const isAuthenticated = localStorage.getItem("token");

    if (!isAuthenticated) {
      setShowAuthModal(true);
      setIsMobileMenuOpen(false); // Close mobile menu if open
    } else {
      navigate(path);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-8 px-6 pointer-events-none">
        
        {/* --- FLOATING PILL CONTAINER --- */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className={`pointer-events-auto flex items-center justify-between px-6 py-4 rounded-full border border-white/10 transition-all duration-500 backdrop-blur-xl ${
            isScrolled 
              ? 'w-[95%] max-w-7xl bg-slate-950/80 shadow-[0_0_40px_rgba(6,182,212,0.1)]' 
              : 'w-full max-w-7xl bg-slate-900/40 shadow-lg'
          }`}
        >
          
          {/* LOGO SECTION */}
          <Link to="/" className="flex items-center gap-4 group ml-2">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:rotate-12 transition-transform">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-2xl font-extrabold tracking-tight text-white leading-tight">
                ACIE<span className="text-cyan-400">.ai</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest leading-none mt-1">
                NavKalpana
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-4 px-8" onMouseLeave={() => setHoveredTab(null)}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <a
                  href={item.path}
                  key={item.name}
                  onClick={(e) => handleProtectedNavigation(e, item.path)}
                  onMouseEnter={() => setHoveredTab(item.name)}
                  className="relative px-6 py-3 text-base font-medium transition-colors z-10 rounded-full cursor-pointer"
                >
                  <span className={`relative z-10 transition-colors duration-300 ${
                    isActive || hoveredTab === item.name ? 'text-white' : 'text-slate-400'
                  }`}>
                    {item.name}
                  </span>

                  {hoveredTab === item.name && (
                    <motion.div
                      layoutId="nav-hover"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {isActive && (
                    <motion.div 
                      layoutId="active-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" 
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* RIGHT SECTION: GITHUB, LOGIN & REGISTER */}
          <div className="flex items-center gap-4 mr-2">
            <a 
              href="https://github.com/NavKalpana-RICR-NK-0001" 
              target="_blank" 
              rel="noreferrer"
              className="hidden lg:flex p-2 text-slate-400 hover:text-white transition-colors hover:scale-110"
            >
              <Github className="w-7 h-7" />
            </a>
            
            {/* LOGIN BUTTON */}
            <Link 
              to="/login" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-base font-medium text-slate-300 hover:text-white transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>

            {/* START ASSESSMENT (Protected) */}
            <a 
              href="/student/dashboard"
              onClick={(e) => handleProtectedNavigation(e, '/student/dashboard')}
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#06b6d4_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-8 py-2 text-base font-semibold text-white backdrop-blur-3xl gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="hidden sm:inline">Start Assessment</span>
                <span className="sm:hidden">Start</span>
              </span>
            </a>

            {/* MOBILE MENU TOGGLE */}
            <button 
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </motion.div>

        {/* --- MOBILE DROPDOWN MENU --- */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-28 left-6 right-6 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl md:hidden pointer-events-auto flex flex-col gap-4"
            >
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    href={item.path}
                    key={item.name}
                    onClick={(e) => handleProtectedNavigation(e, item.path)}
                    className="px-5 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-5 py-3 text-base font-medium text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-5 py-3 text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- PREMIUM LOGIN POPUP MODAL --- */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900/90 border border-white/10 p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center relative overflow-hidden"
            >
              {/* Modal Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-cyan-500/20 rounded-full blur-[60px] pointer-events-none"></div>

              {/* Lock Icon */}
              <div className="w-16 h-16 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Access Restricted</h2>
              <p className="text-slate-400 mb-8 relative z-10 text-sm leading-relaxed">
                You need to be logged in to access the Dashboard, Adaptive Quizzes, and AI Resume tools.
              </p>

              {/* Buttons */}
              <div className="flex gap-4 relative z-10">
                <button 
                  onClick={() => setShowAuthModal(false)} 
                  className="flex-1 py-3 rounded-xl font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowAuthModal(false);
                    navigate('/login');
                  }} 
                  className="flex-1 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
                >
                  Log In Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;