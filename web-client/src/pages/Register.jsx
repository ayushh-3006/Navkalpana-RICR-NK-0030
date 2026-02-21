import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/Api.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, 
  Globe, ShieldCheck, BrainCircuit, ArrowRight, RefreshCcw 
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    gender: "",
    country: "",
    role: "student", // default role
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
    // Clear error automatically when user starts typing
    if (validationError[name]) {
      setValidationError((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      gender: "",
      country: "",
      role: "student",
    });
    setValidationError({});
  };

  const validate = () => {
    let Error = {};

    if (formData.fullName.length < 3) {
      Error.fullName = "Name must be at least 3 characters";
    } else if (!/^[A-Za-z ]+$/.test(formData.fullName)) {
      Error.fullName = "Only alphabets and spaces allowed";
    }

    if (!/^[\w\.]+@(gmail|outlook|ricr|yahoo)\.(com|in|co.in)$/.test(formData.email)) {
      Error.email = "Use Proper Email Format";
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      Error.mobileNumber = "Only Indian Mobile Number allowed";
    }

    if (formData.password.length < 6) {
      Error.password = "Password must be at least 6 characters";
    }

    if (!formData.gender) {
      Error.gender = "Please select gender";
    }

    if (!formData.role) {
      Error.role = "Please select role";
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
      const res = await api.post("/auth/register", formData);
      toast.success(res.data.message);
      handleResetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation Variant
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]  text-slate-200 selection:bg-cyan-500/30 pt-32 py-12 px-4 relative overflow-hidden">
      
      {/* --- BACKGROUND GLOW EFFECTS --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-700/10 rounded-full blur-[150px]" />
      </div>

      {/* --- MAIN GLASS CONTAINER --- */}
      <motion.div 
        initial="hidden" animate="visible" variants={fadeUp}
        className="w-full max-w-5xl bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10"
      >
        
        {/* --- LEFT SIDE: BRANDING --- */}
        <div className="lg:w-2/5 p-10 lg:p-12 bg-gradient-to-br from-slate-950/80 to-slate-900/80 border-r border-white/5 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle overlay pattern/glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none"></div>

          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-10 group relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:rotate-12 transition-transform">
                <BrainCircuit className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">ACIE<span className="text-cyan-400">.ai</span></span>
            </Link>

            <h2 className="text-4xl font-bold leading-tight text-white mb-6 relative z-10">
              Join the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                NavKalpana
              </span> <br/> Revolution.
            </h2>
            <p className="text-slate-400 leading-relaxed relative z-10">
              Create your account to unlock personalized study plans, dynamic mock interviews, and AI-driven resume analytics.
            </p>
          </div>

          <div className="hidden lg:block relative z-10 mt-12">
            <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              System Architecture Active
            </div>
            <p className="text-xs text-slate-600">Secure AES-256 Encryption • JWT Authentication</p>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="lg:w-3/5 p-8 lg:p-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Create Account</h3>
            <p className="text-slate-400 text-sm">Fill in your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit} onReset={handleResetForm} className="space-y-6">
            
            {/* GRID LAYOUT FOR FORM FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className={`w-4 h-4 ${validationError.fullName ? 'text-red-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/50 rounded-xl border outline-none text-white text-sm placeholder-slate-600 transition-all ${
                      validationError.fullName ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    }`}
                  />
                </div>
                {validationError.fullName && <p className="text-red-400 text-[10px] mt-1">{validationError.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className={`w-4 h-4 ${validationError.email ? 'text-red-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange} placeholder="student@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/50 rounded-xl border outline-none text-white text-sm placeholder-slate-600 transition-all ${
                      validationError.email ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    }`}
                  />
                </div>
                {validationError.email && <p className="text-red-400 text-[10px] mt-1">{validationError.email}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className={`w-4 h-4 ${validationError.mobileNumber ? 'text-red-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="9876543210"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/50 rounded-xl border outline-none text-white text-sm placeholder-slate-600 transition-all ${
                      validationError.mobileNumber ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    }`}
                  />
                </div>
                {validationError.mobileNumber && <p className="text-red-400 text-[10px] mt-1">{validationError.mobileNumber}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className={`w-4 h-4 ${validationError.password ? 'text-red-400' : 'text-slate-500'}`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters"
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/50 rounded-xl border outline-none text-white text-sm placeholder-slate-600 transition-all ${
                      validationError.password ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    }`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-cyan-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationError.password && <p className="text-red-400 text-[10px] mt-1">{validationError.password}</p>}
              </div>

              {/* Country (Added to UI since it's in State) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Country</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Globe className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text" name="country" value={formData.country} onChange={handleChange} placeholder="e.g. India"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 rounded-xl border border-slate-800 outline-none text-white text-sm placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              {/* Gender Selection (Glowing Pills) */}
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Gender</label>
                <div className="flex gap-2 bg-slate-950/50 p-1.5 rounded-xl border border-slate-800">
                  {["male", "female", "other"].map((g) => (
                    <label key={g} className={`flex-1 text-center py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                      formData.gender === g ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}>
                      <input type="radio" name="gender" value={g} className="hidden" checked={formData.gender === g} onChange={handleChange} />
                      <span className="capitalize">{g}</span>
                    </label>
                  ))}
                </div>
                {validationError.gender && <p className="text-red-400 text-[10px] mt-1">{validationError.gender}</p>}
              </div>

              {/* Role Selection */}
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Select Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <ShieldCheck className={`w-4 h-4 ${validationError.role ? 'text-red-400' : 'text-cyan-500'}`} />
                  </div>
                  <select
                    name="role" value={formData.role} onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/50 rounded-xl border outline-none text-white text-sm appearance-none transition-all ${
                      validationError.role ? "border-red-500/50" : "border-slate-800 focus:border-cyan-500"
                    }`}
                  >
                    <option value="student" className="bg-slate-900">Student</option>
                    <option value="admin" className="bg-slate-900">Admin</option>
                  </select>
                </div>
                {validationError.role && <p className="text-red-400 text-[10px] mt-1">{validationError.role}</p>}
              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-4 border-t border-white/5">
              <button
                type="reset"
                className="w-1/3 py-3 rounded-xl font-medium text-sm text-slate-300 bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" /> Reset
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-2/3 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                  isLoading 
                    ? "bg-slate-800 cursor-not-allowed" 
                    : "bg-gradient-to-r from-cyan-600 to-purple-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* LOGIN LINK */}
          <div className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-white hover:text-cyan-400 transition-colors">
              Sign In Here
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;