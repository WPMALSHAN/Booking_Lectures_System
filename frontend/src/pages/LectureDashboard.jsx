import { useEffect, useState } from "react";
import API from "../services/api";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import AvailabilityModal from "../pages/Availabilitymodal";

const STATUS = {
  approved:  { bg: "#EFF6FF", border: "#BFDBFE", color: "#1D4ED8", dot: "#3B82F6", label: "Approved"  },
  completed: { bg: "#F0FDF4", border: "#BBF7D0", color: "#15803D", dot: "#22C55E", label: "Completed" },
  cancelled: { bg: "#FEF2F2", border: "#FECACA", color: "#DC2626", dot: "#EF4444", label: "Cancelled" },
  pending:   { bg: "#FEFCE8", border: "#FDE68A", color: "#92400E", dot: "#EAB308", label: "Pending"   },
};

const FILTERS = ["all", "pending", "approved", "completed", "cancelled"];

export default function LecturerDashboard() {
  const [lecturer, setLecturer] = useState({});
  const [stats, setStats] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [lRes, sRes, aRes] = await Promise.all([
        API.get("/auth/user/profile"),
        API.get("/dashboard/lecturer"),
        API.get("/appointments/lecturer"),
      ]);
      setLecturer(lRes.data.user);
      setStats(sRes.data);
      setAppointments(aRes.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    (async () => { await fetchData(); })();
  }, []);

  const handleApprove = async (id) => {
    try { await API.put(`/appointments/approve/${id}`); await fetchData(); }
    catch (e) { console.error(e); alert("Error approving appointment"); }
  };

  const handleCancel = async (id) => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason?.trim()) return alert("Reason is required");
    try { await API.put(`/appointments/cancel/${id}`, { reason }); await fetchData(); }
    catch (e) { console.error(e); alert("Error cancelling appointment"); }
  };

  const handleComplete = async (id) => {
    try { await API.put(`/appointments/complete/${id}`); await fetchData(); }
    catch (e) { console.error(e); alert("Error completing appointment"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try { await API.delete(`/appointments/${id}`); await fetchData(); }
    catch (e) { console.error(e); alert("Error deleting appointment"); }
  };

  const filtered = appointments.filter(a => filter === "all" || a.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "all" ? appointments.length : appointments.filter(a => a.status === f).length;
    return acc;
  }, {});

  const statItems = [
    { label: "Total",      value: stats.totalAppointments || 0, color: "#7c6af7", bg: "#F0EEF9" },
    { label: "Pending",    value: stats.pending || 0,           color: "#92400E", bg: "#FEFCE8" },
    { label: "Approved",   value: stats.approved || 0,          color: "#1D4ED8", bg: "#EFF6FF" },
    { label: "Completed",  value: stats.completed || 0,         color: "#15803D", bg: "#F0FDF4" },
    { label: "Cancelled",  value: stats.cancelled || 0,         color: "#DC2626", bg: "#FEF2F2" },
    { label: "Feedbacks",  value: stats.totalFeedbacks || 0,    color: "#7c6af7", bg: "#F0EEF9" },
    { label: "Avg Rating", value: Number(stats.averageRating || 0).toFixed(1) + " ★", color: "#92400E", bg: "#FEFCE8" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F8F7F4", minHeight: "100vh", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
        * { box-sizing: border-box; }
        .ld-card { background: white; border: 1px solid #E8E6E0; border-radius: 18px; }
        .ld-btn { padding: 9px 18px; border-radius: 10px; border: 1.5px solid #E8E6E0; background: white; color: #555; font-family: 'DM Sans',sans-serif; font-weight: 500; font-size: 0.84rem; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; }
        .ld-btn:hover { border-color: #1a1a2e; color: #1a1a2e; }
        .ld-btn-primary { background: #1a1a2e; color: white; border-color: #1a1a2e; }
        .ld-btn-primary:hover { background: #2d2d4e; }
        .appt-row { background: white; border: 1px solid #E8E6E0; border-radius: 14px; padding: 18px 22px; transition: all 0.2s; }
        .appt-row:hover { box-shadow: 0 8px 30px rgba(26,26,46,0.08); border-color: #c5c0b8; transform: translateY(-1px); }
        .badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 99px; font-size: 0.72rem; font-weight: 600; border: 1px solid; }
        .filter-pill { padding: 7px 16px; border-radius: 99px; border: 1.5px solid #E8E6E0; background: white; color: #666; font-family: 'DM Sans',sans-serif; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; }
        .filter-pill:hover { border-color: #7c6af7; color: #7c6af7; }
        .filter-pill.active { background: #1a1a2e; color: white; border-color: #1a1a2e; }
        .action-btn { padding: 7px 14px; border-radius: 8px; font-family: 'DM Sans',sans-serif; font-weight: 600; font-size: 0.78rem; cursor: pointer; border: 1px solid; transition: all 0.15s; }
        .avatar { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg,#7c6af7,#a78bfa); display: flex; align-items: center; justify-content: center; font-family: Fraunces,serif; font-size: 1.4rem; font-weight: 900; color: white; flex-shrink: 0; overflow: hidden; }
        .section-label { font-size: 0.7rem; color: #999; font-weight: 500; margin-bottom: 2px; letter-spacing: 0.06em; text-transform: uppercase; }
        .section-val { font-size: 0.88rem; color: #444; }
      `}</style>

      {/* Top nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #E8E6E0", padding: "14px 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="12" r="2.5" fill="white" fillOpacity="0.7"/></svg>
            </div>
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e" }}>AcadPortal</span>
            <span style={{ color: "#E8E6E0", fontSize: "1.2rem", marginLeft: 4 }}>·</span>
            <span style={{ fontSize: "0.8rem", color: "#888", fontWeight: 500 }}>Lecturer Portal</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="ld-btn" onClick={fetchData}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Refresh
            </button>
            <button className="ld-btn" onClick={() => navigate("/lecture-progress")}>📊 Progress</button>
            <button className="ld-btn" onClick={() => setShowModal(true)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
              Add Availability
            </button>
            <button className="ld-btn ld-btn-primary" onClick={() => navigate("/lecturer-feedback")}>⭐ Student Feedback</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── Hero Banner ── */}
        <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 150 }}>
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80"
            alt="Lecture hall"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(26,26,46,0.88) 0%, rgba(26,26,46,0.35) 100%)", display: "flex", alignItems: "center", padding: "0 28px" }}>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.15em", color: "rgba(167,139,250,0.9)", textTransform: "uppercase", marginBottom: 4 }}>My Dashboard</p>
              <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 900, fontSize: "2rem", color: "white", letterSpacing: "-0.03em" }}>
                Hello, {lecturer?.firstname || "Lecturer"} 👋
              </h1>
            </div>
          </div>
        </div>

        {/* Profile card */}
        <div className="ld-card" style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div className="avatar">
              {lecturer.profilePicture
                ? <img src={lecturer.profilePicture} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : lecturer.firstname?.[0]}
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: "1.25rem", color: "#1a1a2e", marginBottom: 10 }}>
                {lecturer.firstname} {lecturer.lastname}
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                {[["Email", lecturer.email], ["Department", lecturer.department], ["ID", lecturer.id]].map(([l, v]) => (
                  <div key={l}>
                    <div className="section-label">{l}</div>
                    <div className="section-val">{v || "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
          {statItems.map(({ label, value, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: 14, padding: "18px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "Fraunces, serif", fontWeight: 900, fontSize: "1.8rem", color, letterSpacing: "-0.02em" }}>{value}</div>
              <div style={{ fontSize: "0.74rem", color, opacity: 0.65, marginTop: 2, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          {FILTERS.map((f) => {
            const sc = STATUS[f];
            return (
              <button key={f} onClick={() => setFilter(f)} className={`filter-pill${filter === f ? " active" : ""}`}>
                {f !== "all" && filter !== f && (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc?.dot, display: "inline-block" }}></span>
                )}
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span style={{ fontSize: "0.72rem", opacity: 0.6, fontWeight: 600 }}>{counts[f]}</span>
              </button>
            );
          })}
        </div>

        {/* Appointments */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: "1.15rem", color: "#1a1a2e" }}>Appointments</h2>
            <span style={{ fontSize: "0.8rem", color: "#999" }}>{filtered.length} shown</span>
          </div>

          {filtered.length === 0 ? (
            <div className="ld-card" style={{ padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📭</div>
              <p style={{ color: "#888", fontSize: "0.9rem" }}>No appointments found for this filter.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((appt) => {
                const sc = STATUS[appt.status] || STATUS.pending;
                return (
                  <div key={appt._id} className="appt-row">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "center", flex: 1 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F0EEF9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "Fraunces, serif", fontWeight: 900, fontSize: "0.85rem", color: "#7c6af7" }}>
                          {appt.student?.firstname?.[0]}{appt.student?.lastname?.[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1a1a2e", fontSize: "0.95rem" }}>
                            {appt.student?.firstname} {appt.student?.lastname}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#888", marginTop: 2 }}>
                            {new Date(appt.date).toDateString()} · {appt.startTime}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span className="badge" style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, display: "inline-block" }}></span>
                          {sc.label}
                        </span>

                        {appt.status === "pending" && (
                          <>
                            <button className="action-btn" onClick={() => handleApprove(appt._id)} style={{ background: "#F0FDF4", borderColor: "#BBF7D0", color: "#15803D" }}>✓ Approve</button>
                            <button className="action-btn" onClick={() => handleCancel(appt._id)} style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#DC2626" }}>✕ Cancel</button>
                          </>
                        )}
                        {appt.status === "approved" && (
                          <button className="action-btn" onClick={() => handleComplete(appt._id)} style={{ background: "#EFF6FF", borderColor: "#BFDBFE", color: "#1D4ED8" }}>🎓 Complete</button>
                        )}
                        <button className="action-btn" onClick={() => handleDelete(appt._id)} style={{ background: "white", borderColor: "#E8E6E0", color: "#888" }}
                          onMouseEnter={e => { e.target.style.background = "#FEF2F2"; e.target.style.borderColor = "#FECACA"; e.target.style.color = "#DC2626"; }}
                          onMouseLeave={e => { e.target.style.background = "white"; e.target.style.borderColor = "#E8E6E0"; e.target.style.color = "#888"; }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {showModal && <AvailabilityModal closeModal={() => setShowModal(false)} />}
    </div>
  );
}