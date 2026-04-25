import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ── Helpers ────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
};

const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

const AVATAR_COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-emerald-500",
  "bg-rose-500",  "bg-amber-500",  "bg-cyan-500",
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ── Sub-components ─────────────────────────────────────────
const Stars = ({ rating, size = "md" }) => {
  const sz = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`${sz} ${s <= rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.95 2.778c-.785.57-1.84-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"/>
        </svg>
      ))}
    </div>
  );
};

const RolePill = ({ role }) => {
  const map = {
    student:  "bg-blue-50   text-blue-600   ring-blue-200",
    lecturer: "bg-violet-50 text-violet-600 ring-violet-200",
    guest:    "bg-gray-50   text-gray-500   ring-gray-200",
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ring-1 ${map[role] || map.guest}`}>
      {role}
    </span>
  );
};

const RatingBadge = ({ rating }) => {
  const color =
    rating >= 4 ? "bg-emerald-50 text-emerald-600 ring-emerald-200" :
    rating === 3 ? "bg-amber-50  text-amber-600  ring-amber-200"   :
                   "bg-red-50    text-red-500    ring-red-200";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ring-1 ${color}`}>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.95 2.778c-.785.57-1.84-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"/>
      </svg>
      {rating}.0
    </span>
  );
};

// ── Delete Confirm Modal ───────────────────────────────────
const DeleteModal = ({ onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-fade-in">
      <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </div>
      <h3 className="text-base font-semibold text-gray-800 text-center mb-1">Delete Feedback</h3>
      <p className="text-sm text-gray-500 text-center mb-6">
        This feedback will be permanently removed. This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> Deleting...</>
            : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────
export default function AdminFeedback() {
  const [feedbacks, setFeedbacks]     = useState([]);
  const [filtered,  setFiltered]      = useState([]);
  const [loading,   setLoading]       = useState(true);
  const [error,     setError]         = useState("");
  const [search,    setSearch]        = useState("");
  const [ratingFilter, setRating]     = useState("all");
  const [confirmId, setConfirmId]     = useState(null); // ID pending delete
  const [deleting,  setDeleting]      = useState(false);
  const navigate = useNavigate();

  // Load
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/feedback/all");
        setFeedbacks(res.data || []);
        setFiltered(res.data  || []);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load feedbacks");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter
  useEffect(() => {
    let list = [...feedbacks];
    if (ratingFilter !== "all") list = list.filter((f) => f.rating === Number(ratingFilter));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) =>
        f.student?.name?.toLowerCase().includes(q)  ||
        f.student?.email?.toLowerCase().includes(q) ||
        f.lecturer?.name?.toLowerCase().includes(q) ||
        f.comment?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, ratingFilter, feedbacks]);

  // Delete — two-step: open modal → confirm
  const handleDeleteConfirm = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await API.delete(`/feedback/${confirmId}`);
      setFeedbacks((prev) => prev.filter((f) => f._id !== confirmId));
    } catch (err) {
      alert(err.response?.data?.msg || "Delete failed");
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  // Stats
  const total    = feedbacks.length;
  const avgRating = total
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / total).toFixed(1)
    : null;
  const fiveStars = feedbacks.filter((f) => f.rating === 5).length;
  const lowRatings = feedbacks.filter((f) => f.rating <= 2).length;
  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    star: r,
    count: feedbacks.filter((f) => f.rating === r).length,
    pct: total ? Math.round((feedbacks.filter((f) => f.rating === r).length / total) * 100) : 0,
  }));

  // ── Render ─────────────────────────────────────────────
  return (
    <>
      {/* Delete modal */}
      {confirmId && (
        <DeleteModal
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmId(null)}
        />
      )}

      <div className="min-h-screen bg-slate-50 font-sans">

        {/* ── Header ── */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
            <button onClick={() => navigate("/admin-dashboard")}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors group font-medium">
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
              Dashboard
            </button>

            <div className="w-px h-5 bg-slate-200"/>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-800 leading-none">Student Feedback</h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage all appointment reviews</p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                {total} total
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

          {/* ── KPI row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Feedback",
                value: total || 0,
                sub: "all time",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                  </svg>
                ),
                accent: "text-blue-600 bg-blue-50",
              },
              {
                label: "Average Rating",
                value: avgRating ? `${avgRating} / 5` : "—",
                sub: "across all reviews",
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.95 2.778c-.785.57-1.84-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"/>
                  </svg>
                ),
                accent: "text-amber-500 bg-amber-50",
              },
              {
                label: "5-Star Reviews",
                value: fiveStars,
                sub: `${total ? Math.round((fiveStars / total) * 100) : 0}% of total`,
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                ),
                accent: "text-emerald-600 bg-emerald-50",
              },
              {
                label: "Low Ratings",
                value: lowRatings,
                sub: "rated 1–2 stars",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                ),
                accent: "text-red-500 bg-red-50",
              },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.accent}`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-0.5">{card.label}</p>
                  <p className="text-xl font-bold text-slate-800 leading-none">{card.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Two-column layout: breakdown + filters/list ── */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Rating breakdown sidebar */}
            <div className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-5">Rating breakdown</p>
              <div className="space-y-3.5">
                {ratingCounts.map(({ star, count, pct }) => (
                  <div key={star} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-600">{star}</span>
                        <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.95 2.778c-.785.57-1.84-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-slate-400">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          star >= 4 ? "bg-emerald-400" : star === 3 ? "bg-amber-400" : "bg-red-400"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: filters + cards */}
            <div className="flex-1 min-w-0 space-y-4">

              {/* Filters */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"/>
                  </svg>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search student, lecturer or comment..."
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50 placeholder:text-slate-400"
                  />
                </div>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRating(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50 text-slate-600"
                >
                  <option value="all">All ratings</option>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} star{r !== 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>

              {/* Result count */}
              <p className="text-xs text-slate-400 px-1">
                Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{" "}
                <span className="font-semibold text-slate-600">{total}</span> results
              </p>

              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center py-24">
                  <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"/>
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl p-4">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Empty */}
              {!loading && !error && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600">No feedback found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter</p>
                </div>
              )}

              {/* ── Feedback cards ── */}
              {!loading && !error && filtered.length > 0 && (
                <div className="space-y-3">
                  {filtered.map((f) => (
                    <div key={f._id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-5">

                      <div className="flex flex-col sm:flex-row gap-5">

                        {/* Student column */}
                        <div className="sm:w-44 shrink-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 ${avatarColor(f.student?.name)}`}>
                              {getInitial(f.student?.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                                {f.student?.name || "Unknown"}
                              </p>
                              <RolePill role={f.student?.role || "student"} />
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 truncate pl-12">
                            {f.student?.email || "No email"}
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px bg-slate-100 self-stretch"/>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-3">

                          {/* Top row: stars + rating badge + date */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <Stars rating={f.rating} />
                            <RatingBadge rating={f.rating} />
                            <span className="text-xs text-slate-400 ml-auto">{formatDate(f.createdAt)}</span>
                          </div>

                          {/* Comment */}
                          <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-3">
                            "{f.comment}"
                          </p>

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-4 pt-1">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                              </svg>
                              <span className="font-medium text-slate-600">Lecturer:</span>
                              {f.lecturer?.name || "—"}
                            </div>
                            {f.appointment?.date && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <span className="font-medium text-slate-600">Appointment:</span>
                                {formatDate(f.appointment.date)}
                                {f.appointment.time ? ` · ${f.appointment.time}` : ""}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Delete button */}
                        <div className="flex sm:flex-col items-center justify-end gap-2 shrink-0">
                          <button
                            onClick={() => setConfirmId(f._id)}
                            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-3 py-2 rounded-xl transition-all font-medium"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </>
  );
}