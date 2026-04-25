import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";

/* ─── Custom Tooltip ─── */
const BlueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-blue-100 rounded-2xl px-4 py-3 shadow-xl shadow-blue-100/60 font-mono text-xs">
      <p className="text-blue-400 mb-2 text-[11px] tracking-widest uppercase">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="mb-1" style={{ color: p.color }}>
          <span className="text-slate-400">{p.name}: </span>
          <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ─── Stat Card ─── */
const StatCard = ({ icon, label, value, colorClass, bgClass, borderClass, ringClass }) => (
  <div className={`flex-1 min-w-[160px] rounded-2xl p-7 text-center border ${bgClass} ${borderClass} shadow-sm hover:-translate-y-1 transition-all duration-200 group`}>
    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center text-xl shadow-sm border ${borderClass} ${bgClass} group-hover:scale-110 transition-transform duration-200`}>
      {icon}
    </div>
    <div className={`text-4xl font-extrabold mb-1 ${colorClass} font-mono tracking-tight`}>{value}</div>
    <div className={`text-xs font-semibold tracking-widest uppercase ${colorClass} opacity-70`}>{label}</div>
  </div>
);

/* ─── Section Header ─── */
const SectionHeader = ({ icon, title, subtitle, count }) => (
  <div className="flex items-center gap-4 mb-5">
    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-base shadow-sm">
      {icon}
    </div>
    <div>
      <div className="text-[15px] font-bold text-slate-800 leading-tight">{title}</div>
      {subtitle && <div className="text-[11px] text-slate-400 mt-0.5">{subtitle}</div>}
    </div>
    {count !== undefined && (
      <>
        <div className="flex-1 h-px bg-slate-100" />
        <span className="font-mono text-[11px] text-slate-300 flex-shrink-0">{count} rows</span>
      </>
    )}
    {count === undefined && <div className="flex-1 h-px bg-slate-100" />}
  </div>
);

const StudentProgress = () => {
  const [appointments, setAppointments] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({ completed: 0, cancelled: 0, pending: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const res = await API.get("/appointments/student");
        setAppointments(res.data);

        const completed = res.data.filter(a => a.status === "completed").length;
        const cancelled = res.data.filter(a => a.status === "cancelled").length;
        const pending   = res.data.filter(a => a.status === "approved" || a.status === "pending").length;
        setSummary({ completed, cancelled, pending });

        const dataMap = {};
        res.data.forEach((app) => {
          const date = new Date(app.date).toLocaleDateString();
          if (!dataMap[date]) dataMap[date] = { date, completed: 0, cancelled: 0, pending: 0 };
          if (app.status === "completed") dataMap[date].completed += 1;
          else if (app.status === "cancelled") dataMap[date].cancelled += 1;
          else dataMap[date].pending += 1;
        });
        setChartData(Object.values(dataMap));
      } catch (err) {
        console.error("Error loading appointments:", err);
      }
    };
    loadAppointments();
  }, []);

  const statusConfig = {
    approved:  { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-200",  dot: "bg-blue-500"   },
    completed: { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200", dot: "bg-green-500"  },
    cancelled: { bg: "bg-red-50",    text: "text-red-500",    border: "border-red-200",   dot: "bg-red-400"    },
    pending:   { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200", dot: "bg-amber-400"  },
  };

  const axisStyle = { fill: '#94a3b8', fontSize: 11, fontFamily: 'ui-monospace, monospace' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white font-sans">

      {/* ── Decorative Background Blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-50/60 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ── Main Container ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-mono text-blue-400 tracking-[0.18em] uppercase mb-1">
              Student Portal
            </p>
            <h1 className="text-3xl font-extrabold text-slate-800 leading-tight tracking-tight">
              Appointment{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">
                Progress
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Track your session history and appointment analytics</p>
          </div>
          <button
            onClick={() => navigate("/student-history")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold shadow-sm hover:border-blue-300 hover:text-blue-600 hover:shadow-blue-100/60 hover:shadow-md transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to History
          </button>
        </div>

        {/* ── Summary Cards ── */}
        <div className="flex gap-4 flex-wrap">
          <StatCard
            icon="🎓" label="Completed" value={summary.completed}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
            borderClass="border-emerald-200"
          />
          <StatCard
            icon="✕" label="Cancelled" value={summary.cancelled}
            colorClass="text-red-500"
            bgClass="bg-red-50"
            borderClass="border-red-200"
          />
          <StatCard
            icon="⏳" label="Pending" value={summary.pending}
            colorClass="text-blue-600"
            bgClass="bg-blue-50"
            borderClass="border-blue-200"
          />
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* Bar Chart */}
          <div className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200">
            <SectionHeader icon="📊" title="Status Breakdown" subtitle="Bar chart by date" />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} barSize={13} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip content={<BlueTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8', paddingTop: '10px' }} />
                <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[5,5,0,0]} />
                <Bar dataKey="cancelled" fill="#f87171" name="Cancelled" radius={[5,5,0,0]} />
                <Bar dataKey="pending"   fill="#3b82f6" name="Pending"   radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200">
            <SectionHeader icon="📈" title="Appointment Trend" subtitle="Line chart over time" />
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip content={<BlueTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="cancelled" stroke="#f87171" name="Cancelled" strokeWidth={2.5} dot={{ r: 4, fill: '#f87171', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="pending"   stroke="#3b82f6" name="Pending"   strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-7 pt-7 pb-4">
            <SectionHeader icon="🗂️" title="Summary Table" count={appointments.length} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-100">
                  {["Lecturer", "Date", "Time", "Status", "Reason"].map(h => (
                    <th key={h} className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 tracking-widest uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-slate-300 text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">📭</span>
                        <span>No appointments found</span>
                      </div>
                    </td>
                  </tr>
                ) : appointments.map((app, idx) => {
                  const sc = statusConfig[app.status] || statusConfig.pending;
                  return (
                    <tr
                      key={app._id}
                      className={`border-b border-slate-50 hover:bg-blue-50/40 transition-colors duration-150 ${idx % 2 === 0 ? '' : 'bg-slate-50/30'}`}
                    >
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {app.lecturer?.firstname} {app.lecturer?.lastname}
                      </td>
                      <td className="px-6 py-4 font-mono text-[12px] text-slate-500">
                        {new Date(app.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-mono text-[12px] text-slate-500">
                        {app.startTime} – {app.endTime}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${sc.bg} ${sc.text} ${sc.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {app.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-[13px] ${app.cancelReason ? 'text-red-400' : 'text-slate-300'}`}>
                        {app.cancelReason || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="text-center text-[11px] font-mono text-slate-300 pt-2 pb-4 border-t border-slate-100">
          © {new Date().getFullYear()} AcadPortal · Student Appointment System
        </footer>
      </div>
    </div>
  );
};

export default StudentProgress;