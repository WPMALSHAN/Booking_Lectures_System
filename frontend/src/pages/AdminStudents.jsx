import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../services/api";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  ShieldOff,
  Trash2,
  ArrowLeft,
  Filter,
  AlertCircle,
  UserX,
} from "lucide-react";

const AdminStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState({});
  const PER_PAGE = 8;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/admin/students");
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const setStudentActionLoading = (id, action, val) =>
    setActionLoading((prev) => ({ ...prev, [`${id}_${action}`]: val }));

  const handleBlock = async (studentId) => {
    const confirm = await Swal.fire({
      title: "Block Student?",
      text: "This student will not be able to access the system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1a1a2e",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Yes, Block",
    });
    if (!confirm.isConfirmed) return;
    setStudentActionLoading(studentId, "block", true);
    try {
      await API.put(`/admin/users/${studentId}/block`);
      setStudents((prev) =>
        prev.map((s) => (s._id === studentId ? { ...s, isBlocked: true } : s))
      );
      Swal.fire({
        title: "Blocked!",
        text: "Student has been blocked successfully.",
        icon: "success",
        confirmButtonColor: "#1a1a2e",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to block student.",
        icon: "error",
        confirmButtonColor: "#1a1a2e",
      });
    } finally {
      setStudentActionLoading(studentId, "block", false);
    }
  };

  const handleUnblock = async (studentId) => {
    const confirm = await Swal.fire({
      title: "Unblock Student?",
      text: "This student will be able to access the system again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1a1a2e",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Yes, Unblock",
    });
    if (!confirm.isConfirmed) return;
    setStudentActionLoading(studentId, "unblock", true);
    try {
      await API.put(`/admin/users/${studentId}/unblock`);
      setStudents((prev) =>
        prev.map((s) => (s._id === studentId ? { ...s, isBlocked: false } : s))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to unblock student");
    } finally {
      setStudentActionLoading(studentId, "unblock", false);
    }
  };

  const handleSoftDelete = async (studentId) => {
    const confirm = await Swal.fire({
      title: "Delete Student?",
      text: "This action will remove the student record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Yes, Delete",
    });
    if (!confirm.isConfirmed) return;
    setStudentActionLoading(studentId, "delete", true);
    try {
      await API.delete(`/admin/users/${studentId}/delete`);
      setStudents((prev) => prev.filter((s) => s._id !== studentId));
      Swal.fire({
        title: "Deleted!",
        text: "Student has been removed successfully.",
        icon: "success",
        confirmButtonColor: "#1a1a2e",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to delete student",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setStudentActionLoading(studentId, "delete", false);
    }
  };

  const filtered = students.filter((s) => {
    const matchSearch = `${s.firstname} ${s.lastname} ${s.email} ${s.department}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "active" && !s.isBlocked) ||
      (filter === "blocked" && s.isBlocked);
    return matchSearch && matchFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const activeCount = students.filter((s) => !s.isBlocked).length;
  const blockedCount = students.filter((s) => s.isBlocked).length;

  /* ── Loading ── */
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-500 tracking-wide">
          Loading students…
        </p>
      </div>
    );

  /* ── Error ── */
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="flex items-start gap-4 bg-white border border-red-100 shadow-lg rounded-2xl p-6 max-w-sm w-full">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">
              Something went wrong
            </p>
            <p className="text-xs text-slate-500 mt-1">{error}</p>
            <button
              onClick={fetchStudents}
              className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );

  /* ── Main ── */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Dashboard
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-slate-800">
              Students
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading + stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Student Management
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Monitor, manage and control all enrolled students
            </p>
          </div>

          {/* Stat cards */}
          <div className="flex gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-center shadow-sm min-w-[90px]">
              <p className="text-xl font-bold text-slate-900">
                {students.length}
              </p>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                Total
              </p>
            </div>
            <div className="bg-white border border-emerald-100 rounded-2xl px-5 py-3 text-center shadow-sm min-w-[90px]">
              <p className="text-xl font-bold text-emerald-600">{activeCount}</p>
              <p className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider mt-0.5">
                Active
              </p>
            </div>
            <div className="bg-white border border-red-100 rounded-2xl px-5 py-3 text-center shadow-sm min-w-[90px]">
              <p className="text-xl font-bold text-red-500">{blockedCount}</p>
              <p className="text-[11px] font-medium text-red-400 uppercase tracking-wider mt-0.5">
                Blocked
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email or department…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer"
            >
              <option value="all">All Students</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {["Student", "Email", "Department", "Status", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.length === 0 ? null : paginated.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-xs font-bold text-white">
                            {student.firstname?.[0]?.toUpperCase()}
                            {student.lastname?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-slate-800">
                          {student.firstname} {student.lastname}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {student.email}
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {student.department || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {student.isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!student.isBlocked ? (
                          <button
                            onClick={() => handleBlock(student._id)}
                            disabled={actionLoading[`${student._id}_block`]}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <ShieldOff className="w-3.5 h-3.5" />
                            {actionLoading[`${student._id}_block`]
                              ? "Blocking…"
                              : "Block"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblock(student._id)}
                            disabled={actionLoading[`${student._id}_unblock`]}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            {actionLoading[`${student._id}_unblock`]
                              ? "Unblocking…"
                              : "Unblock"}
                          </button>
                        )}

                        <button
                          onClick={() => handleSoftDelete(student._id)}
                          disabled={actionLoading[`${student._id}_delete`]}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {actionLoading[`${student._id}_delete`]
                            ? "Deleting…"
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {paginated.map((student) => (
              <div key={student._id} className="p-4 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-sm font-bold text-white">
                        {student.firstname?.[0]?.toUpperCase()}
                        {student.lastname?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {student.firstname} {student.lastname}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {student.email}
                      </p>
                    </div>
                  </div>

                  {student.isBlocked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100 flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                      Blocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      Active
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {student.department || "—"}
                  </span>

                  <div className="flex gap-2">
                    {!student.isBlocked ? (
                      <button
                        onClick={() => handleBlock(student._id)}
                        disabled={actionLoading[`${student._id}_block`]}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition disabled:opacity-40"
                      >
                        <ShieldOff className="w-3 h-3" />
                        {actionLoading[`${student._id}_block`] ? "…" : "Block"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnblock(student._id)}
                        disabled={actionLoading[`${student._id}_unblock`]}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition disabled:opacity-40"
                      >
                        <Shield className="w-3 h-3" />
                        {actionLoading[`${student._id}_unblock`] ? "…" : "Unblock"}
                      </button>
                    )}
                    <button
                      onClick={() => handleSoftDelete(student._id)}
                      disabled={actionLoading[`${student._id}_delete`]}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition disabled:opacity-40"
                    >
                      <Trash2 className="w-3 h-3" />
                      {actionLoading[`${student._id}_delete`] ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {paginated.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <UserX className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                No students found
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {(currentPage - 1) * PER_PAGE + 1}–
                  {Math.min(currentPage * PER_PAGE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {filtered.length}
                </span>{" "}
                students
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition ${
                      p === currentPage
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white hover:border-slate-200 border border-transparent hover:shadow-sm"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          Admin Panel · Student Management · All actions are logged
        </p>
      </main>
    </div>
  );
};

export default AdminStudents;