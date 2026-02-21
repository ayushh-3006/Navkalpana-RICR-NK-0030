import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Code, 
  FileText, 
  ChevronRight, 
  Sparkles, 
  LayoutDashboard,
  Brain,
  Rocket
} from 'lucide-react';

const Home = () => {
  // --- ANIMATION VARIANTS ---
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeUp = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30 relative">
      
      {/* --- ANIMATED BACKGROUND GLOWS & GRID --- */}
      <div className="absolute inset-0 z-0">
        {/* Subtle dot grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent_80%)]"></div>
        
        {/* Colored Glows */}
        <div className="absolute overflow-hidden pointer-events-none w-full h-full">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[150px]" 
          />
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <motion.main 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-20 flex flex-col items-center text-center"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-sm font-medium text-cyan-300 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <Sparkles size={16} className="text-cyan-400" />
          NavKalpana Hackathon Project
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1]">
          Preparation to Placement <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Powered by AI
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          The engine that identifies your weaknesses, adapts your study plan, and evaluates your code in real-time. Ready to hack your career?
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5">
          {/* Primary CTA links directly to your Student Dashboard */}
          <Link to="/student/dashboard" className="group relative px-8 py-4 bg-white text-slate-950 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2">
            <LayoutDashboard size={20} className="group-hover:text-cyan-600 transition-colors" />
            <span className="relative z-10">Open Dashboard</span>
          </Link>
          
          {/* Secondary CTA links to Resume Upload */}
          <Link to="/student/dashboard/resume-upload" className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-white font-semibold transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] group backdrop-blur-md">
            Upload Resume 
            <ChevronRight size={20} className="group-hover:translate-x-1 text-slate-500 group-hover:text-cyan-400 transition-all" />
          </Link>
        </motion.div>
      </motion.main>

      {/* --- INTERACTIVE BENTO GRID (Links to your dashboard routes) --- */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-12 pb-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          
          {/* Bento Card 1: Adaptive Quiz */}
          <Link to="/student/dashboard/adaptive-quiz" className="md:col-span-2 group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/80 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] backdrop-blur-md">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500">
              <Brain size={160} />
            </div>
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Target size={32} />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-cyan-50 transition-colors">Adaptive Quizzes</h3>
              <p className="text-slate-400 max-w-md text-lg leading-relaxed">Dynamic tests that scale in difficulty based on your real-time mastery score.</p>
            </div>
          </Link>

          {/* Bento Card 2: AI Assignments */}
          <Link to="/student/dashboard/assignment" className="group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/80 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] backdrop-blur-md">
            <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <Code size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-purple-50 transition-colors">Smart Tasks</h3>
              <p className="text-slate-400 text-base leading-relaxed">AI-evaluated coding assignments to fix your weak points.</p>
            </div>
          </Link>

          {/* Bento Card 3: Interview Prep */}
          <Link to="/student/dashboard/interview-prep" className="group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/80 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] backdrop-blur-md">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Rocket size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-50 transition-colors">Mock Interviews</h3>
              <p className="text-slate-400 text-base leading-relaxed">Simulated environments to test your technical thinking.</p>
            </div>
          </Link>

          {/* Bento Card 4: Resume Analysis */}
          <Link to="/student/dashboard/resume-upload" className="md:col-span-2 group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/80 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:border-green-500/50 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] backdrop-blur-md">
            <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500">
              <FileText size={160} />
            </div>
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:bg-green-500/20 transition-colors">
              <FileText size={32} />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-green-50 transition-colors">Resume Intelligence</h3>
              <p className="text-slate-400 max-w-lg text-lg leading-relaxed">Our algorithm extracts your skills, maps keywords, and calculates a deterministic strength score before you apply.</p>
            </div>
          </Link>

        </div>
      </motion.section>
    </div>
  );
};

export default Home;