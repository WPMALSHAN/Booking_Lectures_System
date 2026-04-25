import { useEffect, useState } from "react";
import API from "../services/api";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

/* ─── Status Badge ─── */
const StatusBadge = ({ status }) => {
  const config = {
    approved:  { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-200",   dot: "bg-blue-500"   },
    completed: { bg: "bg-emerald-50",text: "text-emerald-600",border: "border-emerald-200", dot: "bg-emerald-500"},
    cancelled: { bg: "bg-red-50",    text: "text-red-500",    border: "border-red-200",     dot: "bg-red-400"    },
    pending:   { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200",   dot: "bg-amber-400"  },
  };
  const sc = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${sc.bg} ${sc.text} ${sc.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
      {status}
    </span>
  );
};

/* ─── Stat Card ─── */
const StatCard = ({ icon, label, value, bg, border, textColor }) => (
  <div className={`flex-1 min-w-[130px] rounded-2xl p-5 text-center border ${bg} ${border} shadow-sm hover:-translate-y-1 transition-all duration-200`}>
    <div className="text-2xl mb-2">{icon}</div>
    <div className={`text-3xl font-extrabold font-mono tracking-tight ${textColor}`}>{value}</div>
    <div className={`text-[11px] font-semibold tracking-widest uppercase mt-1 ${textColor} opacity-70`}>{label}</div>
  </div>
);

/* ─── Field Block ─── */
const Field = ({ label, value, mono }) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
    <p className={`text-sm text-slate-700 font-medium ${mono ? 'font-mono' : ''}`}>{value}</p>
  </div>
);

const StudentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const res = await API.get("/appointments/student");
        setAppointments(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    loadAppointments();
  }, []);

  const total     = appointments.length;
  const approved  = appointments.filter(a => a.status === "approved").length;
  const pending   = appointments.filter(a => a.status === "pending").length;
  const cancelled = appointments.filter(a => a.status === "cancelled").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex flex-col">

      {/* ── Decorative Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-50/60 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
      </div>

      {/* ── Main ── */}
      <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 py-10 flex flex-col gap-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-mono text-blue-400 tracking-[0.18em] uppercase mb-1">Student Portal</p>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Appointment{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">History</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Review all your past and upcoming appointments</p>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <button
              onClick={() => navigate("/student")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold shadow-sm hover:border-blue-300 hover:text-blue-600 hover:shadow-blue-100/60 hover:shadow-md transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Dashboard
            </button>
            <button
              onClick={() => navigate("/student-progress")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-200 hover:from-blue-600 hover:to-blue-800 hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 20V10M12 20V4M6 20v-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              View Progress
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="flex gap-3 flex-wrap">
          <StatCard icon="📋" label="Total"     value={total}     bg="bg-white"       border="border-slate-100" textColor="text-slate-700" />
          <StatCard icon="✅" label="Approved"  value={approved}  bg="bg-blue-50"     border="border-blue-100"  textColor="text-blue-600"  />
          <StatCard icon="⏳" label="Pending"   value={pending}   bg="bg-amber-50"    border="border-amber-100" textColor="text-amber-600" />
          <StatCard icon="✕"  label="Cancelled" value={cancelled} bg="bg-red-50"      border="border-red-100"   textColor="text-red-500"   />
        </div>

        {/* ── Appointments List ── */}
        <div>
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#3b82f6" strokeWidth="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-base font-bold text-slate-800">All Appointments</span>
            <div className="flex-1 h-px bg-slate-100" />
            <span className="font-mono text-[11px] text-slate-300 flex-shrink-0">{total} records</span>
          </div>

          {/* Empty State */}
          {appointments.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-16 text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-slate-400 text-sm mb-5">No appointment history found.</p>
              <button
                onClick={() => navigate("/book-appointment")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-200 hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
              >
                + Book Appointment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {appointments.map((app) => (
                <div
                  key={app._id}
                  className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 overflow-hidden group"
                >
                  {/* Blue left accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                  <div className="p-6 flex flex-col gap-5">

                    {/* Card Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                          🎓
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-tight">
                            {app.lecturer?.firstname} {app.lecturer?.lastname}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Lecturer</p>
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-50" />

                    {/* Date & Time */}
                    <div className="flex gap-8">
                      <Field label="Date" value={new Date(app.date).toDateString()} />
                      <Field label="Time" value={`${app.startTime} – ${app.endTime}`} mono />
                    </div>

                    {/* Cancel Reason */}
                    {app.status === "cancelled" && app.cancelReason && (
                      <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="2"/>
                            <path d="M12 8v4M12 16h.01" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-red-400">Cancel Reason</span>
                        </div>
                        <p className="text-sm text-red-500">{app.cancelReason}</p>
                      </div>
                    )}

                    {/* Cancel History */}
                    {app.cancelHistory?.length > 0 && (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
                          Cancel History ({app.cancelHistory.length})
                        </p>
                        <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                          {app.cancelHistory.map((h, idx) => (
                            <div key={idx} className="flex gap-2 text-xs pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                              <span className="font-mono text-slate-300 flex-shrink-0 text-[10px] mt-0.5">
                                {new Date(h.date).toLocaleString()}
                              </span>
                              <span className="text-slate-500">
                                <span className="text-blue-500 font-semibold">{h.cancelledBy}</span> — {h.reason}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default StudentHistory;