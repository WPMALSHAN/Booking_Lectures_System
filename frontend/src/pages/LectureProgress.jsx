import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line,
} from "recharts";

const PIE_COLORS = ["#15803D", "#DC2626"];

const LightTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "white", border: "1px solid #E8E6E0", borderRadius: 10, padding: "10px 14px", fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", boxShadow: "0 8px 24px rgba(26,26,46,0.1)" }}>
      {label && <p style={{ color: "#888", marginBottom: 6, fontFamily: "monospace", fontSize: "0.72rem" }}>{label}</p>}
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color || p.fill || "#7c6af7", marginBottom: 2 }}>
          <span style={{ color: "#bbb" }}>{p.name ?? p.dataKey}: </span>{p.value}
        </p>
      ))}
    </div>
  );
};

export default function LectureProgress() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/dashboard/lecturer").then(r => setStats(r.data)).catch(console.error);
  }, []);

  const pieData = [
    { name: "Completed", value: stats.completed || 0 },
    { name: "Cancelled", value: stats.cancelled || 0 },
  ];

  const barData = [
    { status: "Pending",   count: stats.pending   || 0 },
    { status: "Approved",  count: stats.approved  || 0 },
    { status: "Completed", count: stats.completed || 0 },
    { status: "Cancelled", count: stats.cancelled || 0 },
  ];

  const BAR_COLORS = { Pending: "#EAB308", Approved: "#3B82F6", Completed: "#22C55E", Cancelled: "#EF4444" };

  const lineData = stats.ratingsHistory || [
    { month: "Jan", rating: 4 },
    { month: "Feb", rating: 4.5 },
    { month: "Mar", rating: 4.2 },
    { month: "Apr", rating: 4.8 },
  ];

  const statItems = [
    { label: "Total",      value: stats.totalAppointments || 0,                color: "#7c6af7", bg: "#F0EEF9" },
    { label: "Approved",   value: stats.approved  || 0,                        color: "#1D4ED8", bg: "#EFF6FF" },
    { label: "Completed",  value: stats.completed || 0,                        color: "#15803D", bg: "#F0FDF4" },
    { label: "Cancelled",  value: stats.cancelled || 0,                        color: "#DC2626", bg: "#FEF2F2" },
    { label: "Avg Rating", value: `${Number(stats.averageRating || 0).toFixed(1)} ★`, color: "#92400E", bg: "#FEFCE8" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F8F7F4", minHeight: "100vh", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .lp-btn { padding: 9px 18px; border-radius: 10px; border: 1.5px solid #E8E6E0; background: white; color: #555; font-family: 'DM Sans',sans-serif; font-weight: 500; font-size: 0.84rem; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; }
        .lp-btn:hover { border-color: #1a1a2e; color: #1a1a2e; }
        .chart-card { background: white; border: 1px solid #E8E6E0; border-radius: 18px; padding: 24px; transition: box-shadow 0.2s; }
        .chart-card:hover { box-shadow: 0 8px 30px rgba(26,26,46,0.07); }
        .recharts-legend-item-text { color: #888 !important; font-size: 12px !important; font-family: 'DM Sans', sans-serif !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #E8E6E0", padding: "14px 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="12" r="2.5" fill="white" fillOpacity="0.7"/></svg>
            </div>
            <span style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e" }}>AcadPortal</span>
            <span style={{ color: "#E8E6E0", margin: "0 4px" }}>·</span>
            <span style={{ fontSize: "0.8rem", color: "#888", fontWeight: 500 }}>Lecture Progress</span>
          </div>
          <button className="lp-btn" onClick={() => navigate("/lecturer")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Heading with Banner */}
        <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 130 }}>
          <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80" alt="University" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}/>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(26,26,46,0.9), rgba(26,26,46,0.3))", display: "flex", alignItems: "center", padding: "0 28px" }}>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.15em", color: "rgba(167,139,250,0.9)", textTransform: "uppercase", marginBottom: 4 }}>Lecturer Portal</p>
              <h1 style={{ fontFamily: "Fraunces,serif", fontWeight: 900, fontSize: "2rem", color: "white", letterSpacing: "-0.03em" }}>Lecture Progress</h1>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {statItems.map(({ label, value, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: 14, padding: "18px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "Fraunces,serif", fontWeight: 900, fontSize: "1.9rem", color, letterSpacing: "-0.02em" }}>{value}</div>
              <div style={{ fontSize: "0.74rem", color, opacity: 0.65, marginTop: 2, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>

          {/* Pie */}
          <div className="chart-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🥧</div>
              <div>
                <div style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e" }}>Completed vs Cancelled</div>
                <div style={{ fontSize: "0.75rem", color: "#888", marginTop: 1 }}>Outcome distribution</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={42} paddingAngle={4}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "#E8E6E0" }}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<LightTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar */}
          <div className="chart-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", border: "1px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📊</div>
              <div>
                <div style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e" }}>Appointment Status</div>
                <div style={{ fontSize: "0.75rem", color: "#888", marginTop: 1 }}>Counts by status</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EEF9" vertical={false} />
                <XAxis dataKey="status" tick={{ fill: "#aaa", fontSize: 11, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#aaa", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<LightTooltip />} />
                <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]}>
                  {barData.map(e => <Cell key={e.status} fill={BAR_COLORS[e.status]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line chart */}
        <div className="chart-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEFCE8", border: "1px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📈</div>
            <div>
              <div style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e" }}>Average Rating Over Time</div>
              <div style={{ fontSize: "0.75rem", color: "#888", marginTop: 1 }}>Monthly rating trend</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EEF9" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#aaa", fontSize: 11, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fill: "#aaa", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<LightTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 12 }} />
              <Line type="monotone" dataKey="rating" name="Avg Rating" stroke="#f59e0b" strokeWidth={2.5}
                dot={{ r: 5, fill: "#f59e0b", strokeWidth: 0 }} activeDot={{ r: 7, fill: "#d97706" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}