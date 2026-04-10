import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AdminStudents = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const PER_PAGE = 8;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/auth/admin/students");
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const initials = (s) =>
    `${s.firstname?.[0] || ""}${s.lastname?.[0] || ""}`.toUpperCase();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow font-semibold"
          >
            ← Dashboard
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Student Management
            </h1>
            <p className="text-gray-500 text-sm">
              Manage all students
            </p>
          </div>
        </div>

        <div className="bg-white px-6 py-3 rounded-xl shadow text-center">
          <p className="text-2xl font-bold text-blue-600">{students.length}</p>
          <p className="text-xs text-gray-500">Total Students</p>
        </div>
      </div>


      {/* FILTERS */}
      <div className="flex gap-3 mb-6">
        {["all", "active", "blocked"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border
            ${
              filter === f
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>


      {/* SEARCH */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>


      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-500 text-white text-sm">
            <tr>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Department</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">

                <td className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {initials(s)}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {s.firstname} {s.lastname}
                    </p>
                  </div>
                </td>

                <td className="p-4 text-blue-600">{s.email}</td>

                <td className="p-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    {s.department || "—"}
                  </span>
                </td>

                <td className="p-4">
                  {s.isBlocked ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
                      Blocked
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-600">
                      Active
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>


      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">

          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
          >
            Prev
          </button>

          <p className="text-gray-600 text-sm">
            Page {currentPage} / {totalPages}
          </p>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
};

export default AdminStudents;