import { useEffect, useState } from "react";
import API from "../services/api";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

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

  const statusConfig = {
    approved:  { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)",  color: "#60a5fa",  dot: "#3b82f6"  },
    completed: { bg: "rgba(34,197,94,0.10)",   border: "rgba(34,197,94,0.3)",   color: "#4ade80",  dot: "#22c55e"  },
    cancelled: { bg: "rgba(239,68,68,0.10)",   border: "rgba(239,68,68,0.3)",   color: "#f87171",  dot: "#ef4444"  },
    pending:   { bg: "rgba(234,179,8,0.10)",   border: "rgba(234,179,8,0.3)",   color: "#facc15",  dot: "#eab308"  },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        .sh-root { font-family: 'Sora', sans-serif; background: #020617; min-height: 100vh; color: #e2e8f0; display: flex; flex-direction: column; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .grad-text {
          background: linear-gradient(90deg,#60a5fa,#a78bfa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .stat-card {
          flex: 1; min-width: 130px;
          border-radius: 18px; padding: 22px 20px; text-align: center;
          transition: all 0.25s ease;
        }
        .stat-card:hover { transform: translateY(-3px); }

        .appt-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 24px 26px;
          display: flex; flex-direction: column; gap: 16px;
          transition: all 0.25s ease; position: relative; overflow: hidden;
        }
        .appt-card::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
          background: linear-gradient(180deg,#3b82f6,#a78bfa);
          border-radius:99px 0 0 99px; opacity:0; transition:opacity 0.25s;
        }
        .appt-card:hover { border-color: rgba(59,130,246,0.22); box-shadow: 0 12px 40px rgba(0,0,0,0.35); }
        .appt-card:hover::before { opacity:1; }

        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 99px;
          font-size: 0.75rem; font-weight: 600;
        }

        .label { font-size: 0.72rem; color: #475569; font-weight: 500; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.06em; }
        .value { font-size: 0.9rem; color: #cbd5e1; }

        .cancel-reason-box {
          background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px; padding: 12px 16px;
        }
        .cancel-history-box {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 14px 16px;
        }
        .history-item {
          font-size: 0.8rem; color: #64748b; padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          display: flex; gap: 8px; align-items: flex-start;
        }
        .history-item:last-child { border-bottom: none; padding-bottom: 0; }
        .history-time { color: #334155; flex-shrink: 0; }

        .btn-ghost {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          color: #94a3b8; font-family: 'Sora', sans-serif;
          border-radius: 12px; cursor: pointer; font-weight: 500; font-size: 0.85rem;
          padding: 10px 18px; transition: all 0.2s ease;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); color: #e2e8f0; }

        .btn-primary {
          background: linear-gradient(135deg,#3b82f6,#1d4ed8);
          box-shadow: 0 4px 16px rgba(59,130,246,0.3);
          color: white; font-weight: 600; border: none; cursor: pointer;
          border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 0.85rem;
          padding: 10px 20px; transition: all 0.2s ease;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { background: linear-gradient(135deg,#60a5fa,#3b82f6); transform: translateY(-1px); }

        .section-line { flex:1; height:1px; background: rgba(255,255,255,0.06); }
        .section-title { font-size:1.1rem; font-weight:700; color:#f1f5f9; display:flex; align-items:center; gap:10px; }

        .scroll-list { max-height: 140px; overflow-y: auto; }
        .scroll-list::-webkit-scrollbar { width: 4px; }
        .scroll-list::-webkit-scrollbar-track { background: transparent; }
        .scroll-list::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 99px; }
      `}</style>

      <div className="sh-root">
        <div className="grid-bg"></div>

        <div style={{ position: 'relative', zIndex: 1, flex: 1, maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <p className="mono" style={{ fontSize: '0.7rem', color: '#3b82f6', letterSpacing: '0.15em', marginBottom: '4px' }}>STUDENT PORTAL</p>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2 }}>
                Appointment <span className="grad-text">History</span>
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn-ghost" onClick={() => navigate("/student")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Dashboard
              </button>
              <button className="btn-primary" onClick={() => navigate("/student-progress")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 20V10M12 20V4M6 20v-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                View Progress
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {[
              { label: 'Total',     value: total,     icon: '📋', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.07)', vColor: '#f1f5f9', lColor: '#475569' },
              { label: 'Approved',  value: approved,  icon: '✅', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)',   vColor: '#60a5fa', lColor: '#3b82f6' },
              { label: 'Pending',   value: pending,   icon: '⏳', bg: 'rgba(234,179,8,0.08)',   border: 'rgba(234,179,8,0.2)',    vColor: '#facc15', lColor: '#eab308' },
              { label: 'Cancelled', value: cancelled, icon: '❌', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)',    vColor: '#f87171', lColor: '#ef4444' },
            ].map(({ label, value, icon, bg, border, vColor, lColor }) => (
              <div key={label} className="stat-card" style={{ background: bg, border: `1px solid ${border}` }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{icon}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: vColor }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: lColor, marginTop: '2px', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── Appointments ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <span className="section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#3b82f6" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                All Appointments
              </span>
              <div className="section-line"></div>
              <span className="mono" style={{ fontSize: '0.75rem', color: '#334155', flexShrink: 0 }}>{total} records</span>
            </div>

            {appointments.length === 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '64px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                <p style={{ color: '#475569', fontSize: '0.95rem' }}>No appointment history found.</p>
                <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate("/book-appointment")}>
                  + Book Appointment
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: '16px' }}>
                {appointments.map((app) => {
                  const sc = statusConfig[app.status] || statusConfig.pending;
                  return (
                    <div key={app._id} className="appt-card">

                      {/* Card header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                            🎓
                          </div>
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>
                              {app.lecturer?.firstname} {app.lecturer?.lastname}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#475569' }}>Lecturer</div>
                          </div>
                        </div>
                        <span className="badge" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.dot, display: 'inline-block' }}></span>
                          {app.status}
                        </span>
                      </div>

                      {/* Date / Time */}
                      <div style={{ display: 'flex', gap: '28px', paddingTop: '4px' }}>
                        <div>
                          <div className="label">Date</div>
                          <div className="value">{new Date(app.date).toDateString()}</div>
                        </div>
                        <div>
                          <div className="label">Time</div>
                          <div className="value">{app.startTime} – {app.endTime}</div>
                        </div>
                      </div>

                      {/* Cancel Reason */}
                      {app.status === "cancelled" && app.cancelReason && (
                        <div className="cancel-reason-box">
                          <div className="label" style={{ color: '#f87171', marginBottom: '4px' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }}>
                              <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="2"/>
                              <path d="M12 8v4M12 16h.01" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Cancel Reason
                          </div>
                          <p style={{ fontSize: '0.85rem', color: '#fca5a5' }}>{app.cancelReason}</p>
                        </div>
                      )}

                      {/* Cancel History */}
                      {app.cancelHistory && app.cancelHistory.length > 0 && (
                        <div className="cancel-history-box">
                          <div className="label" style={{ marginBottom: '10px' }}>
                            Cancel History ({app.cancelHistory.length})
                          </div>
                          <div className="scroll-list">
                            {app.cancelHistory.map((h, idx) => (
                              <div key={idx} className="history-item">
                                <span className="history-time mono">[{new Date(h.date).toLocaleString()}]</span>
                                <span style={{ color: '#94a3b8' }}><span style={{ color: '#60a5fa', fontWeight: 600 }}>{h.cancelledBy}</span> — {h.reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default StudentHistory;