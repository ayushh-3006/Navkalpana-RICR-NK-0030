import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import { Toaster } from "react-hot-toast";
import AutoLogout from "./components/AutoLogout.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Dashboards
import StudentDashboard from "./pages/dashboards/student/StudentDashboard.jsx";
import AdminDashboard from "./pages/dashboards/admin/AdminDashboard.jsx";

// Student Nested Pages
import AdaptiveQuiz from "./pages/dashboards/student/AdaptiveQuiz.jsx";
import QuizAttempt from "./pages/dashboards/student/QuizAttempt.jsx";
import QuizResult from "./pages/dashboards/student/QuizResult.jsx";
import QuizHistory from "./pages/dashboards/student/QuizHistory.jsx";

import Assignment from "./pages/dashboards/student/AssignmentPage.jsx";
import InterviewPrep from "./pages/dashboards/student/Interviewprepration.jsx";
import ResumeAnalysis from "./pages/dashboards/student/ResumeAnalysis.jsx";
import ResumeUpload from "./pages/dashboards/student/ResumeUpload.jsx";

const App = () => {
  return (
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
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          >
            {/* Nested Routes */}
            <Route
              index
              element={
                <div className="text-white">
                  Welcome to Student Dashboard ✅
                </div>
              }
            />
            <Route path="adaptive-quiz" element={<AdaptiveQuiz />} />
            <Route path="quiz-history" element={<QuizHistory />} />

            {/* ✅ Dynamic quiz routes */}
            <Route path="quiz/:quizId" element={<QuizAttempt />} />
          <Route path="quiz-result/:attemptId" element={<QuizResult />} />
            <Route path="assignment" element={<Assignment />} />
            <Route path="interview-prep" element={<InterviewPrep />} />
            <Route path="resume-analysis" element={<ResumeAnalysis />} />
            <Route path="resume-upload" element={<ResumeUpload />} />
          </Route>

          {/* Admin Protected Route */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AutoLogout>
    </BrowserRouter>
  );
};

export default App;
