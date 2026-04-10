import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

const PALETTE = [
  ["#3b82f6", "#60a5fa"],
  ["#0ea5e9", "#38bdf8"],
  ["#6366f1", "#818cf8"],
  ["#2563eb", "#3b82f6"],
  ["#0284c7", "#0ea5e9"],
  ["#4f46e5", "#6366f1"],
];

const initials = (str = "") =>
  str.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "L";

const Donut = ({ value, total, color, size = 72 }) => {
  const r = 26, circ = 2 * Math.PI * r;
  const arc = total > 0 ? (value / total) * circ : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <circle cx="30" cy="30" r={r} fill="none" stroke="#e0e7ff" strokeWidth="5.5" />
      <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="5.5"
        strokeDasharray={`${arc} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 30 30)"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }} />
      <text x="30" y="35" textAnchor="middle" fill="#1e40af" fontSize="12"
        fontWeight="800" fontFamily="'DM Sans',sans-serif">{value}</text>
    </svg>
  );
};

const Stars = ({ rating = 0 }) => (
  <span className="flex gap-1">
    {Array.from({ length: 5 }, (_, i) => {
      const full = i < Math.floor(rating), half = !full && i < rating;
      return (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24">
          <defs><linearGradient id={`sg${i}`}><stop offset="50%" stopColor="#f59e0b" /><stop offset="50%" stopColor="#e2e8f0" /></linearGradient></defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={full ? "#f59e0b" : half ? `url(#sg${i})` : "#e2e8f0"} />
        </svg>
      );
    })}
  </span>
);

const Lectures = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchLecturers = async () => {
    try {
      const res = await API.get("/auth/admin/lecturers");
      setLecturers(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load lecturers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLecturers(); }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") closeModal(); };
    if (modalOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [modalOpen]);

  const fetchStats = async (lecturerId) => {
    if (!lecturerId) { setStats({ totalAppointments:0,completed:0,cancelled:0,approved:0,pending:0,rating:0,reviewCount:0 }); return; }
    setStatsLoading(true); setStats(null);
    try {
      const res = await API.get(`/dashboard/lecturer/${lecturerId}`);
      const d = res.data;
      setStats({ totalAppointments: d.totalAppointments??0, completed: d.completed??0, approved: d.approved??0, pending: d.pending??0, cancelled: d.cancelled??0, rating: parseFloat(d.averageRating)||0, reviewCount: d.totalFeedbacks??0 });
    } catch { setStats({ totalAppointments:0,completed:0,cancelled:0,approved:0,pending:0,rating:0,reviewCount:0 }); }
    finally { setStatsLoading(false); }
  };

  const openModal = (lecturer) => {
    const id = lecturer._id ?? lecturer.id;
    setModal(lecturer); setModalOpen(true);
    document.body.style.overflow = "hidden";
    fetchStats(id);
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "";
    setTimeout(() => { setModal(null); setStats(null); }, 320);
  };

  const searchText = search.toLowerCase();
  const filtered = lecturers.filter((l) => {
    const full = `${l.firstname||""} ${l.lastname||""}`.toLowerCase();
    return full.includes(searchText) || (l.department||"").toLowerCase().includes(searchText) || (l.email||"").toLowerCase().includes(searchText) || (l.role||"").toLowerCase().includes(searchText);
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@700;900&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }

        .lc-card { transition: all 0.22s cubic-bezier(.4,0,.2,1); }
        .lc-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(59,130,246,0.15); border-color: #93c5fd !important; }
        .lc-card:active { transform: scale(0.983); }

        .lc-accent { height: 3px; border-radius: 12px 12px 0 0; opacity: 0; transition: opacity 0.25s; }
        .lc-card:hover .lc-accent { opacity: 1; }
        .lc-cta { opacity: 0; transform: translateX(-4px); transition: all 0.2s; }
        .lc-card:hover .lc-cta { opacity: 1; transform: translateX(0); }

        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .fade-up-1 { animation-delay: 0.04s; } .fade-up-2 { animation-delay: 0.08s; }
        .fade-up-3 { animation-delay: 0.12s; } .fade-up-4 { animation-delay: 0.16s; }
        .fade-up-5 { animation-delay: 0.20s; } .fade-up-6 { animation-delay: 0.24s; }

        .modal-bg { transition: opacity 0.3s ease; }
        .modal-box { transition: transform 0.32s cubic-bezier(.34,1.2,.64,1), opacity 0.3s ease; }
        .modal-open .modal-box { transform: translateY(0) scale(1) !important; opacity: 1 !important; }

        @keyframes sksh { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .sk { background: linear-gradient(90deg,#e0e7ff 25%,#bfdbfe 50%,#e0e7ff 75%); background-size:200% 100%; animation:sksh 1.6s infinite; border-radius:8px; }

        .ring-cell { transition: all 0.2s; }
        .ring-cell:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.12); }
        .stat-pill-item { transition: transform 0.2s; }
        .stat-pill-item:hover { transform: translateY(-2px); }

        input:focus { outline: none; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #93c5fd; border-radius: 99px; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        <Navbar />

        {/* ── Hero Banner ── */}
        {!loading && !error && (
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500" style={{ minHeight: 180 }}>
            <div className="absolute inset-0 opacity-10">
              <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&q=80&auto=format&fit=crop"
                alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 90% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
              <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-2">Faculty Directory</p>
              <h1 className="text-white font-black text-4xl mb-1" style={{ fontFamily: "Fraunces, serif", letterSpacing: "-0.03em" }}>
                Meet Our <span className="text-yellow-300">Lecturers</span>
              </h1>
              <p className="text-blue-100 text-sm mt-2 mb-6" style={{ maxWidth: 480 }}>
                Browse faculty members, explore their departments, and view appointment statistics.
              </p>
              <div className="flex gap-8 flex-wrap">
                {[
                  [lecturers.length, "Faculty Members"],
                  [[...new Set(lecturers.map(l => l.department))].length, "Departments"],
                  [filtered.length, "Showing Now"],
                ].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div className="text-white font-black text-2xl" style={{ fontFamily: "Fraunces, serif" }}>{val}</div>
                    <div className="text-blue-200 text-xs font-semibold uppercase tracking-wide">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Search bar ── */}
        <div className="sticky top-0 z-20 bg-white border-b border-blue-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
            <div className="relative flex-1" style={{ maxWidth: 380 }}>
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="w-full pl-9 pr-4 py-2 text-sm bg-blue-50 border border-blue-100 rounded-xl text-slate-700 placeholder-blue-300 focus:border-blue-400 focus:bg-white transition-all"
                placeholder="Search name, department, email…"
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {!loading && !error && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span className="text-xs text-slate-500"><span className="font-bold text-blue-600">{filtered.length}</span> of {lecturers.length}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="max-w-6xl mx-auto px-6 py-8">

          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="flex gap-2">
                {["bg-blue-400","bg-blue-500","bg-blue-600"].map((c,i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${c}`} style={{ animation: `bounce 1.4s ease-in-out ${i*0.18}s infinite` }} />
                ))}
              </div>
              <p className="text-sm text-slate-400">Loading faculty data…</p>
            </div>
          )}

          {error && (
            <div className="flex justify-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-sm">
                <div className="text-3xl mb-3">⚠️</div>
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
              {filtered.length === 0 ? (
                <div className="col-span-full flex flex-col items-center py-20 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  </div>
                  <p className="text-slate-500 font-semibold">No results found</p>
                  <p className="text-slate-400 text-sm">Try adjusting your search</p>
                </div>
              ) : filtered.map((lecturer, i) => {
                const [ca, cb] = PALETTE[i % PALETTE.length];
                return (
                  <div key={i} className={`lc-card bg-white border border-slate-100 rounded-2xl p-5 cursor-pointer relative overflow-hidden fade-up fade-up-${Math.min(i+1,6)}`}
                    onClick={() => openModal(lecturer)}>
                    <div className="lc-accent absolute top-0 left-0 right-0" style={{ background: `linear-gradient(90deg,${ca},${cb})` }} />

                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-md flex-shrink-0"
                        style={{ background: `linear-gradient(135deg,${ca},${cb})`, fontFamily: "Fraunces, serif" }}>
                        {initials(lecturer.department)}
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm mt-1" style={{ boxShadow: "0 0 6px #34d399" }} />
                    </div>

                    <div className="font-bold text-slate-800 text-sm mb-0.5 leading-tight">
                      {(lecturer.firstname||"") + " " + (lecturer.lastname||"")}
                    </div>
                    <div className="font-semibold text-slate-700 text-sm mb-1" style={{ fontFamily: "Fraunces, serif" }}>{lecturer.department}</div>
                    <div className="text-xs text-slate-400 truncate mb-4">{lecturer.email}</div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full uppercase tracking-wide">{lecturer.role}</span>
                      <span className="lc-cta text-xs font-semibold text-blue-500 flex items-center gap-1">
                        View stats
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Footer />
      </div>

      {/* ── Modal ── */}
      <div className={`modal-bg fixed inset-0 z-50 flex items-center justify-center p-5 ${modalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(30,58,138,0.35)", backdropFilter: "blur(10px)" }}
        onClick={(e) => e.target === e.currentTarget && closeModal()}>
        <div className={`modal-box bg-white rounded-3xl shadow-2xl w-full overflow-y-auto custom-scroll ${modalOpen ? "modal-open" : ""}`}
          style={{ maxWidth: 610, maxHeight: "90vh", transform: "translateY(28px) scale(0.96)", opacity: 0, border: "1.5px solid #bfdbfe" }}>

          {modal && (() => {
            const idx = lecturers.findIndex(l => l.email === modal.email);
            const [ca, cb] = PALETTE[idx % PALETTE.length];
            return (
              <>
                {/* Header */}
                <div className="relative" style={{ background: `linear-gradient(135deg, ${ca}18, ${cb}08)`, borderBottom: "1px solid #e0e7ff", padding: "1.5rem 1.7rem 1.2rem" }}>
                  <button onClick={closeModal}
                    className="absolute top-4 right-4 w-8 h-8 rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-400 hover:border-red-200 flex items-center justify-center text-sm transition-all">✕</button>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0"
                      style={{ background: `linear-gradient(135deg,${ca},${cb})`, fontFamily: "Fraunces, serif" }}>
                      {initials(modal.department)}
                    </div>
                    <div>
                      <div className="font-black text-slate-800 text-lg leading-tight" style={{ fontFamily: "Fraunces, serif" }}>{modal.department}</div>
                      <div className="text-slate-400 text-sm mt-0.5">{modal.email}</div>
                      <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 5px #34d399" }} />
                        {modal.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7">
                  {statsLoading ? (
                    <div className="flex flex-col gap-3">
                      {[["36%",12],["100%",78],["100%",12],["100%",108]].map(([w,h],i) => (
                        <div key={i} className="sk" style={{ width: w, height: h }} />
                      ))}
                    </div>
                  ) : stats ? (
                    <>
                      {/* Total */}
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Appointment Overview</p>
                      <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-4">
                        <div>
                          <div className="text-xs text-slate-400 font-semibold mb-1">Total Appointments</div>
                          <div className="text-4xl font-black text-blue-600" style={{ fontFamily: "Fraunces, serif", letterSpacing: "-0.05em" }}>{stats.totalAppointments}</div>
                          <div className="text-xs text-slate-400 mt-1">All time records</div>
                        </div>
                        <Donut value={stats.totalAppointments} total={Math.max(stats.totalAppointments,1)} color="#3b82f6" size={66} />
                      </div>

                      {/* Rings */}
                      <div className="grid grid-cols-4 gap-2 mb-5">
                        {[["Completed",stats.completed,"#10b981"],["Approved",stats.approved,"#3b82f6"],["Pending",stats.pending,"#f59e0b"],["Cancelled",stats.cancelled,"#ef4444"]].map(([label,value,color]) => (
                          <div key={label} className="ring-cell bg-white border border-slate-100 rounded-2xl py-3 px-2 flex flex-col items-center gap-2">
                            <Donut value={value} total={stats.totalAppointments||1} color={color} size={62} />
                            <div className="text-xs font-bold text-slate-400 text-center uppercase tracking-wide">{label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Status pills */}
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Breakdown</p>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {[
                          ["Completed",stats.completed,"✅","#10b981","#d1fae5","#a7f3d0"],
                          ["Approved",stats.approved,"🔵","#3b82f6","#dbeafe","#bfdbfe"],
                          ["Pending",stats.pending,"⏳","#f59e0b","#fef3c7","#fde68a"],
                          ["Cancelled",stats.cancelled,"❌","#ef4444","#fee2e2","#fecaca"],
                        ].map(([label,value,icon,color,bg,border]) => (
                          <div key={label} className="stat-pill-item flex-1 min-w-28 flex items-center gap-3 rounded-2xl p-3 border" style={{ background: bg, borderColor: border }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background: `${color}22` }}>{icon}</div>
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</div>
                              <div className="font-black text-lg" style={{ color, fontFamily: "Fraunces, serif", letterSpacing: "-0.04em" }}>{value}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bars */}
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Distribution</p>
                      <div className="flex flex-col gap-3 mb-5">
                        {[["Completed",stats.completed,"#10b981"],["Approved",stats.approved,"#3b82f6"],["Pending",stats.pending,"#f59e0b"],["Cancelled",stats.cancelled,"#ef4444"]].map(([label,value,color]) => {
                          const pct = stats.totalAppointments > 0 ? Math.round((value/stats.totalAppointments)*100) : 0;
                          return (
                            <div key={label}>
                              <div className="flex justify-between items-center text-sm mb-1.5">
                                <span className="text-slate-500 font-medium">{label}</span>
                                <span className="font-bold" style={{ color }}>{value} <span className="text-slate-400 font-normal text-xs">({pct}%)</span></span>
                              </div>
                              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="border-t border-slate-100 my-5" />

                      {/* Rating */}
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Rating & Reviews</p>
                      <div className="flex items-center gap-5 bg-amber-50 border border-amber-100 rounded-2xl p-5">
                        <div className="text-5xl font-black text-amber-500" style={{ fontFamily: "Fraunces, serif", letterSpacing: "-0.05em" }}>{(stats.rating||0).toFixed(1)}</div>
                        <div>
                          <Stars rating={stats.rating||0} />
                          <div className="text-xs text-amber-400 mt-1.5">{stats.reviewCount||0} review{(stats.reviewCount||0)!==1?"s":""}</div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      <style>{`
        .modal-open .modal-box { transform: translateY(0) scale(1) !important; opacity: 1 !important; }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.55);opacity:0.3} 40%{transform:scale(1);opacity:1} }
      `}</style>
    </>
  );
};

export default Lectures;