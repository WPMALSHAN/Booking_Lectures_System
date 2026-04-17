import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

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
    if (!window.confirm("Block this student?")) return;
    setStudentActionLoading(studentId, "block", true);
    try {
      await API.put(`/admin/users/${studentId}/block`);
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId ? { ...s, isBlocked: true } : s
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to block student");
    } finally {
      setStudentActionLoading(studentId, "block", false);
    }
  };

  const handleUnblock = async (studentId) => {
    if (!window.confirm("Unblock this student?")) return;
    setStudentActionLoading(studentId, "unblock", true);
    try {
      await API.put(`/admin/users/${studentId}/unblock`);
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId ? { ...s, isBlocked: false } : s
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to unblock student");
    } finally {
      setStudentActionLoading(studentId, "unblock", false);
    }
  };

  const handleSoftDelete = async (studentId) => {
    if (!window.confirm("Soft delete this student?")) return;
    setStudentActionLoading(studentId, "delete", true);
    try {
      await API.delete(`/admin/users/${studentId}/delete`);
      setStudents((prev) =>
        prev.filter((s) => s._id !== studentId)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete student");
    } finally {
      setStudentActionLoading(studentId, "delete", false);
    }
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      `${s.firstname} ${s.lastname} ${s.email} ${s.department}`
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-red-600">
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white px-8 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
          >
            ← Admin Dashboard
          </button>
          <div>
            <h1 className="text-2xl font-bold text-blue-900">
              All Students
            </h1>
            <p className="text-sm text-blue-500">
              Manage and monitor enrolled students
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 px-6 py-3 rounded-xl text-center">
          <p className="text-xl font-bold text-blue-900">
            {students.length}
          </p>
          <p className="text-xs text-blue-600">
            Total Students
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-blue-200 focus:border-blue-500 rounded-lg px-4 py-2 text-sm outline-none"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-blue-200 focus:border-blue-500 rounded-lg px-4 py-2 text-sm outline-none bg-white"
        >
          <option value="all">All Students</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full">
          <thead className="bg-blue-50 border-b border-blue-100">
            <tr>
              {["Student", "Email", "Department", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginated.map((student) => (
              <tr
                key={student._id}
                className="border-b border-blue-100 hover:bg-blue-50 transition"
              >
                <td className="px-6 py-4 text-sm font-medium text-blue-900">
                  {student.firstname} {student.lastname}
                </td>

                <td className="px-6 py-4 text-sm text-blue-500">
                  {student.email}
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    {student.department || "—"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {student.isBlocked ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
                      Blocked
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                      Active
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 flex gap-2">
                  {!student.isBlocked && (
                    <button
                      onClick={() => handleBlock(student._id)}
                      disabled={actionLoading[`${student._id}_block`]}
                      className="px-3 py-1 text-xs rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading[`${student._id}_block`] ? "Blocking..." : "Block"}
                    </button>
                  )}

                  {student.isBlocked && (
                    <button
                      onClick={() => handleUnblock(student._id)}
                      disabled={actionLoading[`${student._id}_unblock`]}
                      className="px-3 py-1 text-xs rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading[`${student._id}_unblock`] ? "Unblocking..." : "Unblock"}
                    </button>
                  )}

                  <button
                    onClick={() => handleSoftDelete(student._id)}
                    disabled={actionLoading[`${student._id}_delete`]}
                    className="px-3 py-1 text-xs rounded-md bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading[`${student._id}_delete`] ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-blue-100">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded-md text-blue-700"
            >
              Prev
            </button>

            <span className="text-sm text-blue-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded-md text-blue-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;