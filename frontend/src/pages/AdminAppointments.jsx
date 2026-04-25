import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Loader2 } from "lucide-react";

const AdminAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await API.get("/appointments/admin/all");
      
      // Log the response to see the actual structure
      console.log("API Response:", res);
      console.log("Response data:", res.data);
      
      // Handle different possible response structures
      let data = [];
      
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data.appointments)) {
        data = res.data.appointments;
      } else if (res.data && Array.isArray(res.data.data)) {
        data = res.data.data;
      } else if (res.data && typeof res.data === 'object') {
        // If it's an object, try to extract the array
        const keys = Object.keys(res.data);
        console.log("Response keys:", keys);
        data = Array.isArray(res.data[keys[0]]) ? res.data[keys[0]] : [];
      }
      
      console.log("Processed appointments:", data);
      
      setAppointments(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      console.error("Error response:", err.response);
      setError(
        err.response?.data?.message || 
        err.message ||
        "Failed to load appointments. Please try again."
      );
      setAppointments([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Array.isArray(appointments)) {
      setFiltered([]);
      return;
    }

    if (search.trim() === "") {
      setFiltered(appointments);
      return;
    }

    const result = appointments.filter((appointment) => {
      const studentName = appointment.studentName?.toLowerCase() || "";
      const email = appointment.email?.toLowerCase() || "";
      const searchTerm = search.toLowerCase();
      
      return studentName.includes(searchTerm) || email.includes(searchTerm);
    });
    setFiltered(result);
  }, [search, appointments]);

  const getStatusColor = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "APPROVED":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
      case "REJECTED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 p-6">
        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg max-w-md">
          <p className="font-semibold mb-2">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchAppointments} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Appointments
        </h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by student name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={fetchAppointments}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Refresh
        </button>
      </div>

      {!Array.isArray(filtered) || filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {search ? "No appointments match your search" : "No appointments found"}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Total appointments loaded: {appointments.length}
          </p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            Showing {filtered.length} of {appointments.length} appointments
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((appointment, index) => (
              <div 
                key={appointment.id || appointment._id || index} 
                className="bg-white shadow-lg rounded-2xl hover:shadow-xl transition-shadow border border-gray-200"
              >
                <div className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {appointment.studentName || appointment.student_name || "N/A"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {appointment.email || "No email provided"}
                  </p>
                  <div className="pt-2 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Date:</span>{" "}
                      <span className="text-gray-600">
                        {appointment.date || appointment.appointmentDate || "N/A"}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Time:</span>{" "}
                      <span className="text-gray-600">
                        {appointment.time || appointment.appointmentTime || "N/A"}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Status:</span>{" "}
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status || "UNKNOWN"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAppointments;