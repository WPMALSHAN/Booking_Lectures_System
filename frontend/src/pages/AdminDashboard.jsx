import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
    <div className="text-2xl">{icon}</div>

    <div className="mt-3">
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  const admin = {
    name: "Dr. Sarah Mitchell",
    role: "System Administrator",
    department: "Academic Affairs",
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/admin/analytics");
        setAnalytics(res.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const stats = [
    { label: "Students", value: analytics.totalStudents || 0, icon: "🎓" },
    { label: "Lecturers", value: analytics.totalLecturers || 0, icon: "👨‍🏫" },
    { label: "Appointments", value: analytics.totalAppointments || 0, icon: "📅" },
    { label: "Completed", value: analytics.completedAppointments || 0, icon: "✅" },
    { label: "Cancelled", value: analytics.cancelledAppointments || 0, icon: "❌" },
    { label: "Feedback", value: analytics.totalFeedbacks || 0, icon: "💬" },
  ];

  const quickActions = [
    { label: "Add Student", icon: "🎓", path: "/admin/students" },
    { label: "Add Lecturer", icon: "👨‍🏫", path: "/admin/lecturers" },
    { label: "Appointments", icon: "📅", path: "/admin/appointments" },
    { label: "Feedback", icon: "💬", path: "/admin/feedback" },
  ];

  const activity = [
    "New appointment booked",
    "Lecturer added to system",
    "Feedback submitted",
    "Appointment cancelled",
    "New student registered",
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 text-white flex flex-col">

        <div className="p-6 border-b border-blue-900">
          <h1 className="text-xl font-bold">AdminPortal</h1>
          <p className="text-xs text-blue-200">University System</p>
        </div>

        <div className="p-6 border-b border-blue-900">
          <div className="bg-blue-900 p-4 rounded-lg text-center">
            <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center font-bold mx-auto">
              {admin.name[0]}
            </div>

            <p className="mt-2 font-semibold">{admin.name}</p>
            <p className="text-xs text-blue-200">{admin.role}</p>
            <p className="text-xs text-blue-300">{admin.department}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <button
            onClick={() => navigate("/admin-dashboard")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-900"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/students")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-900"
          >
            Students
          </button>

          <button
            onClick={() => navigate("/admin/lecturers")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-900"
          >
            Lecturers
          </button>

          <button
            onClick={() => navigate("/admin/appointments")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-900"
          >
            Appointments
          </button>

          <button
            onClick={() => navigate("/admin/feedback")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-900"
          >
            Feedback
          </button>

        </nav>

      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">

          <h2 className="text-lg font-semibold text-gray-800">
            Dashboard
          </h2>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              System Online
            </span>

            <span>{admin.name}</span>
          </div>

        </header>

        {/* Content */}
        <div className="p-8 space-y-8">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {loading ? (
              <p className="text-gray-500">Loading analytics...</p>
            ) : (
              stats.map((s) => <StatCard key={s.label} {...s} />)
            )}

          </div>

          {/* Quick Actions + Activity */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

              <h3 className="font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-4">

                {quickActions.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => navigate(a.path)}
                    className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition text-left"
                  >
                    <div className="text-xl">{a.icon}</div>
                    <p className="mt-2 text-sm text-gray-700">{a.label}</p>
                  </button>
                ))}

              </div>

            </div>

            {/* Activity */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

              <h3 className="font-semibold text-gray-800 mb-4">
                Recent Activity
              </h3>

              <div className="space-y-3">

                {activity.map((a, i) => (
                  <div
                    key={i}
                    className="text-sm text-gray-500 border-b border-gray-200 pb-2"
                  >
                    {a}
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;