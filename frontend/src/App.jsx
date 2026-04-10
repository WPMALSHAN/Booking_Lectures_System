import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LecturerDashboard from "./pages/LectureDashboard";
import StudentDashboard from "./pages/studentDashboard"; // fix capitalization
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BookAppointment from "./pages/BookAppointment";
import StudentHistory from "./pages/StudentHistory";
import StudentProgress from "./pages/StudentProgress";
import Feedback from "./pages/Feedback";
import FeedbackHistory from "./pages/FeedbackHistory";
import LectureProgress from "./pages/LectureProgress";
import LecturerFeedback from "./pages/LecturerFeedback";
import Lectures from "./pages/Lectures";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminLecturers from "./pages/Adminlecturers";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/lecturer"
        element={
          <PrivateRoute role="lecturer">
            <LecturerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/student"
        element={
          <PrivateRoute role="student">
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/student-history" element={<StudentHistory />} />
      <Route path="/student-progress" element={<StudentProgress />} />
      <Route path="/feedback/:id" element={<Feedback />} />
      <Route path="/feedback-history" element={<FeedbackHistory />} />
      <Route path="/lecture-progress" element={<LectureProgress />} />
      <Route path="/lecturer-feedback" element={<LecturerFeedback />} />
      <Route path="/lecturers" element={<Lectures />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/students" element={<AdminStudents />} />
      <Route path="/admin/lecturers" element={<AdminLecturers />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
