// src/pages/dashboards/student/StudentDashboard.jsx
import { Outlet, NavLink } from "react-router-dom";

export default function StudentDashboard() {
  const navLinks = [
    { name: "Adaptive Quiz", path: "adaptive-quiz" },
    { name: "Assignment", path: "assignment" },
    { name: "Interview Prep", path: "interview-prep" },
    { name: "Quiz Result", path: "quiz-result" },
    { name: "Resume Analysis", path: "resume-analysis" },
    { name: "Resume Upload", path: "resume-upload" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md p-4">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-sm text-blue-200 mt-1">
          Welcome back! Select a module to continue.
        </p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-md p-4 flex-shrink-0">
          <nav>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors ${
                        isActive ? "bg-blue-500 text-white" : "text-gray-700"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Example Cards */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-2">Today's Progress</h2>
              <p className="text-gray-600">You have 2 quizzes and 1 assignment pending.</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-2">Upcoming Interviews</h2>
              <p className="text-gray-600">Next interview prep session at 4:00 PM.</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-2">Resume Status</h2>
              <p className="text-gray-600">Resume uploaded successfully. Ready for analysis.</p>
            </div>
          </div>

          {/* Nested routes render here */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
