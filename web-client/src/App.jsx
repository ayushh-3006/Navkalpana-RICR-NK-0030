import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import { Toaster } from "react-hot-toast";
import AutoLogout from "./components/AutoLogout.jsx";

// Dashboards
import StudentDashboard from "./pages/dashboards/student/StudentDashboard.jsx";
import AdminDashboard from "./pages/dashboards/admin/AdminDashboard.jsx";

// Student Nested Pages
import AdaptiveQuiz from "./pages/dashboards/student/AdaptiveQuiz.jsx"
import Assignment from "./pages/dashboards/student/AssignmentPage.jsx";
import InterviewPrep from  "./pages/dashboards/student/Interviewprepration.jsx"
import QuizResult from "./pages/dashboards/student/Interviewprepration.jsx"
import ResumeAnalysis from "./pages/dashboards/student/ResumeAnalysis.jsx"
import ResumeUpload from "./pages/dashboards/student/ResumeUpload.jsx"

// Protected Route (or Auth wrapper)
import { AuthContext } from "./context/AuthContext.jsx";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <AutoLogout> 
        <Header />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Student Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <AuthContext role="student">
                <StudentDashboard />
              </AuthContext>
            }
          >
            {/* Nested Routes */}
            <Route path="adaptive-quiz" element={<AdaptiveQuiz />} />
            <Route path="assignment" element={<Assignment />} />
            <Route path="interview-prep" element={<InterviewPrep />} />
            <Route path="quiz-result" element={<QuizResult />} />
            <Route path="resume-analysis" element={<ResumeAnalysis />} />
            <Route path="resume-upload" element={<ResumeUpload />} />
          </Route>

          {/* Admin Protected Route */}
          <Route
            path="/admin/dashboard"
            element={
              <AuthContext role="admin">
                <AdminDashboard />
              </AuthContext>
            }
          />
        </Routes>
        </AutoLogout>
      </BrowserRouter>
    </>
  );
};

export default App;
