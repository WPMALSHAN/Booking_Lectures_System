import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Footer from "../components/footer";   // ← your existing Footer component
import Swal from "sweetalert2";

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
    { label: "Students",     value: analytics.totalStudents         || 0, icon: "🎓" },
    { label: "Lecturers",    value: analytics.totalLecturers        || 0, icon: "👨‍🏫" },
    { label: "Appointments", value: analytics.totalAppointments     || 0, icon: "📅" },
    { label: "Completed",    value: analytics.completedAppointments || 0, icon: "✅" },
    { label: "Cancelled",    value: analytics.cancelledAppointments || 0, icon: "❌" },
    { label: "Feedback",     value: analytics.totalFeedbacks        || 0, icon: "💬" },
  ];

  const quickActions = [
    { label: "Add Student",  icon: "🎓", path: "/admin/students"      },
    { label: "Add Lecturer", icon: "👨‍🏫", path: "/admin/lecturers"     },
    { label: "Appointments", icon: "📅", path: "/admin/appointments"   },
    { label: "Feedback",     icon: "💬", path: "/admin/feedback"       },
    { label: "Messages",     icon: "✉️", path: "/admin/chat"           },
  ];

  const activity = [
    "New appointment booked",
    "Lecturer added to system",
    "Feedback submitted",
    "Appointment cancelled",
    "New student registered",
  ];

  const navLinks = [
    { label: "Dashboard",    path: "/admin-dashboard"    },
    { label: "Students",     path: "/admin/students"     },
    { label: "Lecturers",    path: "/admin/lecturers"    },
    { label: "Appointments", path: "/admin-appointments" },
    { label: "Feedback",     path: "/admin/feedback"     },
    { label: "Messages",     path: "/admin/chat"         },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* ══════════════════════════════════
          SITE HEADER
      ══════════════════════════════════ */}
      <header style={{ background: "#020617", color: "#fff" }}>

        {/* Top info strip */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "6px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", fontFamily: "'JetBrains Mono', monospace", color: "#1e293b", letterSpacing: "0.06em" }}>
              University Academic Management System
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.72rem", color: "#1e293b", fontFamily: "'JetBrains Mono', monospace" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, background: "#4ade80", borderRadius: "50%", display: "inline-block", animation: "hpulse 2s infinite" }}></span>
                All systems online
              </span>
              <span style={{ color: "rgba(255,255,255,0.08)" }}>|</span>
              <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
        </div>

        {/* Main nav bar */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>

          {/* Brand — matches footer brand style */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", boxShadow: "0 3px 12px rgba(59,130,246,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" stroke="white" strokeWidth="2.2" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="white" fillOpacity="0.6"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "1rem", fontWeight: 800, color: "#f1f5f9", lineHeight: 1, letterSpacing: "-0.01em", fontFamily: "'Sora', sans-serif" }}>AcadPortal</p>
              <p style={{ fontSize: "0.68rem", color: "#475569", marginTop: 2, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>Admin Console</p>
            </div>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}>
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{ padding: "7px 14px", borderRadius: 8, fontSize: "0.85rem", color: "#475569", background: "none", border: "none", cursor: "pointer", fontFamily: "'Sora', sans-serif", fontWeight: 500, transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.08)"; e.currentTarget.style.color = "#60a5fa"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#475569"; }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Admin profile pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "7px 16px", flexShrink: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "'Sora', sans-serif" }}>
              {admin.name[0]}
            </div>
            <div style={{ lineHeight: 1.3 }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9", fontFamily: "'Sora', sans-serif" }}>{admin.name}</p>
              <p style={{ fontSize: "0.68rem", color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>{admin.role}</p>
            </div>
          </div>

        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
          @keyframes hpulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        `}</style>
      </header>
      {/* ══ END SITE HEADER ══ */}


      {/* ══════════════════════════════════
          BODY — sidebar + main (unchanged)
      ══════════════════════════════════ */}
      <div className="flex flex-1">

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
            <button onClick={() => navigate("/admin-dashboard")}    className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-900">Dashboard</button>
            <button onClick={() => navigate("/admin/students")}     className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-900">Students</button>
            <button onClick={() => navigate("/admin/lecturers")}    className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-900">Lecturers</button>
            <button onClick={() => navigate("/admin/appointments")} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-900">Appointments</button>
            <button onClick={() => navigate("/admin/feedback")}     className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-900">Feedback</button>
          </nav>

        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col">

          {/* Topbar */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
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

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
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

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {activity.map((a, i) => (
                    <div key={i} className="text-sm text-gray-500 border-b border-gray-200 pb-2">
                      {a}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
      {/* ══ END BODY ══ */}


      {/* ══════════════════════════════════
          YOUR FOOTER COMPONENT
      ══════════════════════════════════ */}
      <Footer />

    </div>
  );
};

export default AdminDashboard;