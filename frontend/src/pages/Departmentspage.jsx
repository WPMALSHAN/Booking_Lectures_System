import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

const departments = [
  {
    id: "it",
    code: "IT",
    name: "Information Technology",
    tagline: "Building the digital backbone",
    description:
      "Explore the fundamentals of computing systems, networks, and IT infrastructure. Our IT department prepares students to design, manage, and secure the technology systems that power modern organizations.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="10" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M16 34v4M32 34v4M10 38h28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M14 20h4M22 20h4M30 20h4M14 25h8M26 25h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: "blue",
    accent: "#1a6cc4",
    light: "#e8f1fb",
    courses: ["Network Architecture", "Database Management", "Cloud Computing", "IT Security"],
    students: 340,
    instructors: 18,
  },
  {
    id: "se",
    code: "SE",
    name: "Software Engineering",
    tagline: "Crafting software at scale",
    description:
      "Master the art and science of building robust, scalable software systems. From agile methodologies to advanced design patterns, our SE program bridges the gap between theory and industry practice.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M16 17l-7 7 7 7M32 17l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M27 12l-6 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    color: "violet",
    accent: "#6d38e0",
    light: "#f0ebff",
    courses: ["Software Architecture", "DevOps & CI/CD", "Agile Engineering", "API Design"],
    students: 290,
    instructors: 15,
  },
  {
    id: "ds",
    code: "DS",
    name: "Data Science",
    tagline: "Turning data into decisions",
    description:
      "Harness the power of data through statistics, machine learning, and visualization. Our Data Science program equips you with the analytical tools to derive actionable insights from complex datasets.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M8 36l9-12 8 6 7-14 8 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="17" cy="24" r="2.5" fill="currentColor"/>
        <circle cx="25" cy="30" r="2.5" fill="currentColor"/>
        <circle cx="32" cy="16" r="2.5" fill="currentColor"/>
      </svg>
    ),
    color: "teal",
    accent: "#0d7a5f",
    light: "#e2f5ef",
    courses: ["Statistical Modeling", "Machine Learning", "Big Data Analytics", "Data Visualization"],
    students: 260,
    instructors: 14,
  },
  {
    id: "cs",
    code: "CS",
    name: "Cyber Security",
    tagline: "Defending the digital world",
    description:
      "Become a guardian of the digital frontier. Our Cyber Security department trains specialists in threat analysis, ethical hacking, cryptography, and the policies that protect organizations worldwide.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 6l14 6v10c0 9-6 16-14 18C16 38 10 31 10 22V12l14-6z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M18 24l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "red",
    accent: "#c0392b",
    light: "#fdecea",
    courses: ["Ethical Hacking", "Network Security", "Cryptography", "Incident Response"],
    students: 210,
    instructors: 12,
  },
  {
    id: "ai",
    code: "AI",
    name: "Artificial Intelligence",
    tagline: "Engineering tomorrow's intelligence",
    description:
      "Dive deep into the algorithms and architectures powering the AI revolution. From neural networks to natural language processing, our AI program prepares you for the cutting edge of intelligent systems.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M24 10v4M24 34v4M10 24h4M34 24h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="2.5" fill="currentColor"/>
        <path d="M15 15l2.8 2.8M30.2 30.2L33 33M15 33l2.8-2.8M30.2 17.8L33 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: "amber",
    accent: "#b06f10",
    light: "#fef3e2",
    courses: ["Deep Learning", "NLP & LLMs", "Computer Vision", "Reinforcement Learning"],
    students: 230,
    instructors: 13,
  },
];

const colorMap = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-800",   ring: "ring-blue-300",   dot: "bg-blue-500"   },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", badge: "bg-violet-100 text-violet-800", ring: "ring-violet-300", dot: "bg-violet-500" },
  teal:   { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   badge: "bg-teal-100 text-teal-800",   ring: "ring-teal-300",   dot: "bg-teal-500"   },
  red:    { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    badge: "bg-red-100 text-red-800",    ring: "ring-red-300",    dot: "bg-red-500"    },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-800",  ring: "ring-amber-300",  dot: "bg-amber-500"  },
};

function StatPill({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">{label}</span>
    </div>
  );
}

function DepartmentCard({ dept, onClick, isActive }) {
  const c = colorMap[dept.color];
  return (
    <button
      onClick={() => onClick(dept)}
      className={`group w-full text-left rounded-2xl border-2 p-6 transition-all duration-300 cursor-pointer
        ${isActive
          ? `${c.bg} ${c.border} ring-2 ${c.ring} shadow-lg scale-[1.02]`
          : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md hover:scale-[1.01]"
        }`}
    >
      <div className="flex items-start gap-4">
        <div className={`rounded-xl p-3 transition-colors duration-300 ${isActive ? c.bg : "bg-gray-50 group-hover:" + c.bg} ${c.text}`}>
          {dept.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>{dept.code}</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-base leading-snug">{dept.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{dept.tagline}</p>
        </div>
        <svg viewBox="0 0 20 20" fill="none" className={`w-5 h-5 flex-shrink-0 mt-1 transition-transform duration-300 ${isActive ? `rotate-90 ${c.text}` : "text-gray-300 group-hover:text-gray-400"}`}>
          <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </button>
  );
}

function DetailPanel({ dept,  }) {
  const c = colorMap[dept.color];
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden h-full flex flex-col">
      {/* Header banner */}
      <div className={`${c.bg} px-8 pt-8 pb-6 border-b ${c.border}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`rounded-2xl p-3.5 bg-white shadow-sm ${c.text}`}>{dept.icon}</div>
          <div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.badge}`}>{dept.code}</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{dept.name}</h2>
          </div>
        </div>
        <div className="flex gap-8 pt-2">
          <StatPill label="Students" value={dept.students} />
          <div className="w-px bg-gray-200" />
          <StatPill label="Instructors" value={dept.instructors} />
          <div className="w-px bg-gray-200" />
          <StatPill label="Courses" value={dept.courses.length} />
        </div>
      </div>

      <div className="flex-1 px-8 py-6 overflow-y-auto">
        {/* Description */}
        <p className="text-gray-600 leading-relaxed text-[15px]">{dept.description}</p>

        {/* Courses */}
        <div className="mt-6">
          <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">Core Modules</h4>
          <div className="grid grid-cols-2 gap-2">
            {dept.courses.map((course) => (
              <div key={course} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${c.bg} border ${c.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
                <span className={`text-sm font-medium ${c.text}`}>{course}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <button className="w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ dept, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", date: "", slot: "", course: "" });
  const c = colorMap[dept.color];

  const slots = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];

  const handleSubmit = () => setStep(3);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-[slideUp_0.3s_ease]">
        {/* Modal header */}
        <div className={`${c.bg} px-6 py-5 border-b ${c.border} flex items-center justify-between`}>
          <div>
            <p className={`text-xs font-semibold ${c.text}`}>{dept.code} · Lecture Booking</p>
            <h3 className="text-lg font-bold text-gray-900 mt-0.5">{dept.name}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-500 transition-colors">
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? "text-white" : "bg-gray-100 text-gray-400"}`}
                  style={step >= s ? { backgroundColor: dept.accent } : {}}>
                  {step > s ? "✓" : s}
                </div>
                <span className={`text-xs ${step >= s ? "text-gray-700 font-medium" : "text-gray-400"}`}>{s === 1 ? "Details" : "Schedule"}</span>
                {s < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ "--tw-ring-color": dept.accent + "66" }}
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
                  placeholder="you@university.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Course</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all bg-white"
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                >
                  <option value="">Select a course</option>
                  {dept.courses.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={() => setStep(2)}
                disabled={!form.name || !form.email || !form.course}
                className="w-full mt-2 py-3.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                style={{ backgroundColor: dept.accent }}>
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Preferred Date</label>
                <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button key={slot} onClick={() => setForm({ ...form, slot })}
                      className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${form.slot === slot ? "text-white border-transparent" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                      style={form.slot === slot ? { backgroundColor: dept.accent, borderColor: dept.accent } : {}}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  ← Back
                </button>
                <button onClick={handleSubmit}
                  disabled={!form.date || !form.slot}
                  className="flex-1 py-3.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: dept.accent }}>
                  Confirm Booking
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                style={{ backgroundColor: dept.light, color: dept.accent }}>
                ✓
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your lecture for <strong>{form.course}</strong> is booked on <strong>{form.date}</strong> at <strong>{form.slot}</strong>.
                A confirmation has been sent to <strong>{form.email}</strong>.
              </p>
              <button onClick={onClose} className="mt-6 w-full py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: dept.accent }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DepartmentsPage() {
  const [active, setActive] = useState(departments[0]);
  const [booking, setBooking] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 font-medium mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Online Lecture Booking — Open Now
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-3">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">Departments</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Select a department to browse courses and book your next online lecture session with our expert instructors.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Departments", value: "5" },
            { label: "Total Students", value: "1,330" },
            { label: "Expert Instructors", value: "72" },
            { label: "Courses Offered", value: "20+" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 text-center shadow-sm">
              <div className="text-2xl font-extrabold text-gray-900">{value}</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-5 gap-6 items-start">
          {/* Department list */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold px-1 mb-1">
              All Departments
            </h2>
            {departments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                dept={dept}
                onClick={setActive}
                isActive={active?.id === dept.id}
              />
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3 lg:sticky lg:top-24">
            {active && (
              <DetailPanel dept={active} onBook={setBooking} />
            )}
          </div>
        </div>
      </main>

      {/* Booking modal */}
      {booking && (
        <BookingModal dept={booking} onClose={() => setBooking(null)} />
      )}

      <Footer />

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}