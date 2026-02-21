import React, { useState, useContext } from "react";
import api from "../config/Api.jsx";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, BrainCircuit, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationError[name]) {
      setValidationError((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    let Error = {};
    if (!/^[\w\.]+@(gmail|outlook|ricr|yahoo)\.(com|in|co.in)$/.test(formData.email)) {
      Error.email = "Use Proper Email Format";
    }
    if (formData.password.length < 6) {
      Error.password = "Password must be at least 6 characters";
    }
    setValidationError(Error);
    return Object.keys(Error).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validate()) {
      setIsLoading(false);
      toast.error("Fill the Form Correctly");
      return;
    }

    try {
      const res = await api.post("/auth/login", formData);
      toast.success(res.data.message);

      const userData = res.data.data;
      const token = res.data.token;

      login(userData, token);

      if (userData.role === "student") {
        navigate("/student/dashboard");
      } else if (userData.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid Role Found!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex bg-[#050505] text-white selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[150px]" />
      </div>

      {/* LEFT SIDE: BRANDING */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-16 relative z-10 border-r border-white/5 bg-slate-900/20 backdrop-blur-sm">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-xl">
          <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:rotate-12 transition-transform">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">ACIE<span className="text-cyan-400">.ai</span></span>
          </Link>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Welcome back to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              The Future of Prep.
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-10">
            Log in to access your AI-generated study plans, adaptive quizzes, and dynamic resume analytics. Let's continue building your career.
          </p>
        </motion.div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="flex w-full lg:w-1/2 mt-10 items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative"
        >
          
          {/* --- NEW ANIMATED EMOJI SECTION --- */}
          <div className="flex justify-center mb-6">
            <motion.div 
              animate={{ 
                y: [0, -10, 0], // Floats up and down
                rotate: [0, 5, -5, 0] // Gentle wave effect
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-20 h-20 bg-slate-800/80 rounded-full border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-md"
            >
              <span className="text-4xl">👨‍💻</span>
            </motion.div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-slate-400 text-sm">Welcome back, Coder!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* EMAIL INPUT */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`w-5 h-5 ${validationError.email ? 'text-red-400' : 'text-slate-500'}`} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 rounded-xl border outline-none text-white placeholder-slate-600 transition-all duration-300 ${
                    validationError.email 
                      ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                      : "border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 hover:border-slate-700"
                  }`}
                />
              </div>
              {validationError.email && (
                <p className="text-red-400 text-xs mt-2 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400"></span> {validationError.email}
                </p>
              )}
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 ${validationError.password ? 'text-red-400' : 'text-slate-500'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 bg-slate-950/50 rounded-xl border outline-none text-white placeholder-slate-600 transition-all duration-300 ${
                    validationError.password 
                      ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                      : "border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 hover:border-slate-700"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationError.password && (
                <p className="text-red-400 text-xs mt-2 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400"></span> {validationError.password}
                </p>
              )}
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-cyan-500 hover:text-cyan-400 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white transition-all duration-300 ${
                isLoading 
                  ? "bg-slate-800 cursor-not-allowed" 
                  : "bg-gradient-to-r from-cyan-600 to-purple-600 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* REGISTER LINK */}
          <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/10 pt-6">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-white hover:text-cyan-400 transition-colors">
              Create one now
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default Login;