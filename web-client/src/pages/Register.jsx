import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/Api.jsx";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    gender: "",
    country: "",
    role: "student", // ✅ default role
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
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      gender: "",
      country: "",
      role: "student", // reset ke baad bhi student
    });
    setValidationError({});
  };

  const validate = () => {
    let Error = {};

    // Name validation
    if (formData.fullName.length < 3) {
      Error.fullName = "Name must be at least 3 characters";
    } else if (!/^[A-Za-z ]+$/.test(formData.fullName)) {
      Error.fullName = "Only alphabets and spaces allowed";
    }

    // Email validation
    if (
      !/^[\w\.]+@(gmail|outlook|ricr|yahoo)\.(com|in|co.in)$/.test(
        formData.email
      )
    ) {
      Error.email = "Use Proper Email Format";
    }

    // Mobile validation
    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      Error.mobileNumber = "Only Indian Mobile Number allowed";
    }

    // Password validation
    if (formData.password.length < 6) {
      Error.password = "Password must be at least 6 characters";
    }

    // Gender validation
    if (!formData.gender) {
      Error.gender = "Please select gender";
    }

    // Role validation
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

  return (
    <div className="min-h-screen flex">
      {/* Left Side Premium Info */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 text-white items-center justify-center p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Join Us Today 🚀</h1>
          <p className="text-lg opacity-90">
            Create your account and start building something amazing.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Create Account
          </h2>

          <form
            onSubmit={handleSubmit}
            onReset={handleResetForm}
            className="space-y-4"
          >
            {/* Full Name */}
            <div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition
                ${
                  validationError.fullName
                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                    : "border-gray-300 focus:ring-2 focus:ring-indigo-400"
                }`}
              />
              {validationError.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {validationError.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition
                ${
                  validationError.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                    : "border-gray-300 focus:ring-2 focus:ring-indigo-400"
                }`}
              />
              {validationError.email && (
                <p className="text-red-500 text-sm mt-1">
                  {validationError.email}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Mobile Number"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition
                ${
                  validationError.mobileNumber
                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                    : "border-gray-300 focus:ring-2 focus:ring-indigo-400"
                }`}
              />
              {validationError.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {validationError.mobileNumber}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition
                ${
                  validationError.password
                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                    : "border-gray-300 focus:ring-2 focus:ring-indigo-400"
                }`}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 cursor-pointer text-sm text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? "Hide" : "Show"}
              </span>

              {validationError.password && (
                <p className="text-red-500 text-sm mt-1">
                  {validationError.password}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Select Gender</p>
              <div className="flex gap-4">
                {["male", "female", "other"].map((g) => (
                  <label
                    key={g}
                    className={`px-4 py-2 border rounded-lg cursor-pointer capitalize
                    ${
                      formData.gender === g
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-300 text-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      className="hidden"
                      checked={formData.gender === g}
                      onChange={handleChange}
                    />
                    {g}
                  </label>
                ))}
              </div>

              {validationError.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {validationError.gender}
                </p>
              )}
            </div>

            {/* Role Dropdown */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Select Role</p>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg outline-none transition
                ${
                  validationError.role
                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                    : "border-gray-300 focus:ring-2 focus:ring-indigo-400"
                }`}
              >
                <option value="student">Student</option>
 
                 <option value="admin">Admin</option>
              </select>

              {validationError.role && (
                <p className="text-red-500 text-sm mt-1">
                  {validationError.role}
                </p>
              )}
            </div>

            {/* Buttons */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-lg font-semibold text-white transition
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
              }`}
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>

            <button
              type="reset"
              className="w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
