import { useState } from "react";
import Footer from "../components/footer";

export default function ContactUs() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);

    // Reset success message and form after 3 seconds
    setTimeout(() => {
      setSuccess(false);
      e.target.reset();
    }, 3000);
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50/50 min-h-screen">

      {/* HERO SECTION - Deep Navy Gradient */}
      <section
        className="h-[320px] flex flex-col items-center justify-center text-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 58, 138, 0.7)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400')",
        }}
      >
        <div className="z-10 px-4">
          <p className="text-blue-400 uppercase tracking-[0.3em] text-xs font-bold mb-3">
            Available 24/7
          </p>
          <h1 className="text-white text-5xl md:text-6xl font-extrabold tracking-tight">
            Contact <span className="text-blue-400">Us</span>
          </h1>
          <div className="h-1 w-20 bg-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>
      </section>

      {/* INFO CARDS - Clean White & Soft Blue Icons */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ["Location", "Visit Us", "SLIIT, New Kandy Rd, Malabe"],
            ["Phone", "Call Us", "+94 11 754 4801"],
            ["Email", "Mail Address", "info@sliit.lk"],
            ["Hours", "Opening Time", "Mon - Fri (9AM - 5PM)"],
          ].map(([label, title, desc]) => (
            <div
              key={title}
              className="bg-white border border-slate-100 rounded-2xl p-6 text-center hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group"
            >
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-2 tracking-widest">{label}</p>
              <h3 className="text-slate-800 font-bold text-md mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CENTERED CONTACT FORM - Professional Modern Card */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-50 p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">
              Write Us a <span className="text-blue-600">Message</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Our academic and support teams are ready to help you with any inquiries you may have.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Full Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Subject</label>
              <input
                type="text"
                placeholder="Inquiry about..."
                required
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Message</label>
              <textarea
                placeholder="Describe your inquiry..."
                required
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50/50 h-32 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-slate-200 transition-all transform active:scale-[0.99]"
            >
              Send Message
            </button>
          </form>

          {success && (
            <div className="mt-8 text-center p-4 bg-blue-50 text-blue-700 rounded-xl font-semibold border border-blue-100 flex items-center justify-center gap-2">
              <span>✅</span> Your message has been sent successfully.
            </div>
          )}
        </div>
      </section>

      {/* FIXED MAP SECTION - SLIIT MALABE */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="group relative w-full h-[450px] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
          <iframe
            className="w-full h-full border-0 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798511776186!2d79.9703642750438!3d6.914677493084725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae256db1ba67d31%3A0x2b836344269a7536!2sSLIIT%20Malabe%20Campus!5e0!3m2!1sen!2slk!4v1715456789012!5m2!1sen!2slk"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="SLIIT Malabe Campus Map"
          ></iframe>
        </div>
      </section>

      <Footer />
    </div>
  );
}