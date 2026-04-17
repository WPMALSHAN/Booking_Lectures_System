import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

const Lectures = () => {
  const [lecturers, setLecturers] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/auth/admin/lecturers")
      .then((res) => setLecturers(res.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [modalOpen]);

  const fetchStats = async (id) => {
    try {
      const res = await API.get(`/dashboard/lecturer/${id}`);
      setStats(res.data);
    } catch {
      setStats(null);
    }
  };

  const openModal = (lecturer) => {
    const id = lecturer._id ?? lecturer.id;
    setModal(lecturer);
    setTimeout(() => setModalOpen(true), 10);
    fetchStats(id);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setModal(null);
      setStats(null);
    }, 300);
  };

  const filtered = lecturers.filter((l) => {
    const text = search.toLowerCase();
    return (
      `${l.firstname} ${l.lastname}`.toLowerCase().includes(text) ||
      (l.department || "").toLowerCase().includes(text)
    );
  });

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-6 py-10">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Lecturers
        </h1>

        {/* SEARCH */}
        <input
          className="mb-8 w-full max-w-md px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Search lecturers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((lecturer, i) => (
            <div
              key={i}
              className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
            >
              {/* Avatar */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500 text-white font-bold mb-4">
                {lecturer.department?.[0] || "L"}
              </div>

              {/* Info */}
              <h3 className="font-semibold text-gray-800">
                {lecturer.firstname} {lecturer.lastname}
              </h3>

              <p className="text-blue-600 text-sm font-medium">
                {lecturer.department}
              </p>

              <p className="text-gray-400 text-xs mb-4">
                {lecturer.email}
              </p>

              {/* BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(lecturer);
                }}
                className="text-blue-600 text-sm font-semibold hover:text-blue-800 flex items-center gap-1"
              >
                View stats →
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {/* MODAL */}
      {modal && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black/40 transition ${
            modalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl w-[400px] p-6 shadow-xl border border-blue-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <h2 className="text-xl font-bold text-blue-700 mb-2">
              {modal.firstname} {modal.lastname}
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              {modal.department}
            </p>

            {/* Stats */}
            {stats ? (
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-blue-600">Total:</span> {stats.totalAppointments}</p>
                <p><span className="font-semibold text-green-600">Completed:</span> {stats.completed}</p>
                <p><span className="font-semibold text-yellow-600">Pending:</span> {stats.pending}</p>
                <p><span className="font-semibold text-red-600">Cancelled:</span> {stats.cancelled}</p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Loading stats...</p>
            )}

            {/* Close */}
            <button
              onClick={closeModal}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Lectures;