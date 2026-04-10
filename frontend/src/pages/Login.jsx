import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim());

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;

    if (name === "password") {
      v = value.slice(0, 8);
      setPasswordError(v.length !== 8 ? "Password must be exactly 8 characters" : "");
    }

    setFormData((p) => ({ ...p, [name]: v }));

    if (name === "email") {
      setEmailError(
        !value.trim()
          ? "Email is required"
          : !validateEmail(value)
          ? "Please enter a valid Gmail address"
          : ""
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim()) return setEmailError("Email is required");
    if (!validateEmail(formData.email))
      return setEmailError("Please enter a valid Gmail address");

    if (formData.password.length !== 8)
      return setPasswordError("Password must be exactly 8 characters");

    try {
      setLoading(true);

      const res = await API.post("/auth/login", formData);

      login(res.data);

      setFormData({ email: "", password: "" });

      navigate(
        res.data.user.role === "lecturer"
          ? "/lecturer"
          : res.data.user.role === "student"
          ? "/student"
          : "/admin-dashboard"
      );
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
      setFormData((p) => ({ ...p, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        minHeight: "100vh",
        background: "#F8F7F4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <style>{`
      * { box-sizing: border-box; }

      .auth-input{
        width:100%;
        padding:13px 16px 13px 44px;
        background:white;
        border:1.5px solid #E8E6E0;
        border-radius:12px;
        outline:none;
        font-size:0.9rem;
      }

      .auth-input:focus{
        border-color:#7c6af7;
        box-shadow:0 0 0 3px rgba(124,106,247,0.12);
      }

      .auth-input.error{
        border-color:#ef4444;
      }

      .auth-btn{
        width:100%;
        padding:14px;
        border-radius:12px;
        background:#1a1a2e;
        color:white;
        border:none;
        cursor:pointer;
        font-weight:600;
      }

      .auth-btn:hover{
        background:#2d2d4e;
      }

      .spinner{
        animation:spin .8s linear infinite;
      }

      @keyframes spin{
        to{transform:rotate(360deg)}
      }

      .icon-wrap{
        position:absolute;
        left:14px;
        top:50%;
        transform:translateY(-50%);
        color:#bbb;
      }

      .field-wrap{
        position:relative;
      }

      .err-msg{
        font-size:.78rem;
        color:#ef4444;
        margin-top:5px;
      }

      .auth-side-photo{
        position:absolute;
        inset:0;
        background-image:url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80');
        background-size:cover;
        background-position:center;
        opacity:.12;
      }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 960,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(26,26,46,0.15)",
        }}
      >
        {/* LEFT FORM SIDE */}

        <div
          style={{
            background: "white",
            padding: "52px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* BACK BUTTON */}

          <button
            onClick={() => navigate(-1)}
            style={{
              alignSelf: "flex-start",
              marginBottom: 20,
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid #E8E6E0",
              background: "#fff",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>

          {/* LOGO */}

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "#1a1a2e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></div>

            <span
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                color: "#1a1a2e",
              }}
            >
              AcadPortal
            </span>
          </div>

          <h1
            style={{
              fontWeight: 900,
              fontSize: "2rem",
              color: "#1a1a2e",
              marginBottom: 6,
            }}
          >
            Welcome back
          </h1>

          <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: 28 }}>
            Sign in to your academic dashboard.
          </p>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 10,
                padding: "11px 14px",
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#dc2626" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* EMAIL */}

            <div>
              <div className="field-wrap">
                <span className="icon-wrap">📧</span>

                <input
                  type="email"
                  name="email"
                  placeholder="Gmail address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`auth-input ${emailError ? "error" : ""}`}
                />
              </div>

              {emailError && <p className="err-msg">{emailError}</p>}
            </div>

            {/* PASSWORD */}

            <div>
              <div className="field-wrap">
                <span className="icon-wrap">🔒</span>

                <input
                  type="password"
                  name="password"
                  placeholder="Password (8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  maxLength={8}
                  className={`auth-input ${passwordError ? "error" : ""}`}
                />
              </div>

              {passwordError && <p className="err-msg">{passwordError}</p>}
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading || emailError || passwordError}
              className="auth-btn"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.85rem",
              color: "#999",
              marginTop: 20,
            }}
          >
            No account yet?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "#7c6af7",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Create one free
            </span>
          </p>
        </div>

        {/* RIGHT SIDE PANEL */}

        <div
          style={{
            background: "#1a1a2e",
            padding: "52px 44px",
            position: "relative",
            color: "white",
          }}
        >
          <div className="auth-side-photo"></div>

          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              lineHeight: 1.3,
              marginBottom: 20,
              position: "relative",
            }}
          >
            Your academic schedule, simplified.
          </h2>

          <p style={{ opacity: 0.6, fontSize: "0.9rem", position: "relative" }}>
            Book appointments, track progress, and collaborate with your institution.
          </p>
        </div>
      </div>
    </div>
  );
}