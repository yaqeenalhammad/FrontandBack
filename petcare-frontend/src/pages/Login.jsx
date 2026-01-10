import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { api } from "../api";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (mode === "register") {
      if (!fullName.trim()) {
        setError("Full name is required");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    try {
      setLoading(true);

      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const payload =
        mode === "login"
          ? { email, password }
          : {
              fullName: fullName.trim(),
              email,
              password,
              confirmPassword,
            };

      const res = await api.post(endpoint, payload);

      if (mode === "login") {
        localStorage.setItem("token", res?.data?.token ?? "");
        localStorage.setItem("user", JSON.stringify(res?.data?.user ?? null));
      }

      navigate("/home");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    email.includes("@") &&
    password.length >= 6 &&
    (mode === "login" ||
      (fullName.trim().length > 0 && password === confirmPassword));

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <img src={Logo} alt="PetCare Jordan" style={styles.logo} />
        </div>

        <h1 style={styles.title}>{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
        <p style={styles.subtitle}>
          {mode === "login" ? "Login to continue 💙" : "Join PetCare Jordan 💙"}
        </p>

        {mode === "register" && (
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={styles.input}
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>
        )}

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            onFocus={focusIn}
            onBlur={focusOut}
          />
        </div>

        {mode === "register" && (
          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          style={{
            ...styles.button,
            ...(loading || !canSubmit ? styles.buttonDisabled : {}),
          }}
          disabled={loading || !canSubmit}
          onMouseEnter={(e) => {
            if (loading || !canSubmit) return;
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.filter = "brightness(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.filter = "none";
          }}
          onMouseDown={(e) => {
            if (loading || !canSubmit) return;
            e.currentTarget.style.transform = "translateY(0px)";
          }}
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <p style={styles.footer}>
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                style={styles.link}
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
              >
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                style={styles.link}
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function focusIn(e) {
  e.currentTarget.style.borderColor = "rgba(24, 119, 242, 0.55)";
  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(24, 119, 242, 0.14)";
  e.currentTarget.style.background = "rgba(255,255,255,0.95)";
}

function focusOut(e) {
  e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
  e.currentTarget.style.boxShadow = "none";
  e.currentTarget.style.background = "rgba(255,255,255,0.78)";
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background:
      "radial-gradient(900px 600px at 20% 10%, rgba(79,163,199,0.22), transparent 60%)," +
      "radial-gradient(800px 520px at 80% 0%, rgba(159,211,234,0.25), transparent 60%)," +
      "radial-gradient(900px 700px at 50% 100%, rgba(186,230,253,0.30), transparent 65%)," +
      "linear-gradient(135deg, #f6f2eb, #e8f4fb)",
  },

  card: {
    width: "min(420px, 100%)",
    background: "rgba(255, 253, 249, 0.92)",
    borderRadius: 22,
    padding: 28,
    textAlign: "center",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
    backdropFilter: "blur(10px)",
  },

  logoWrap: {
    width: 92,
    height: 92,
    margin: "0 auto 14px",
    borderRadius: 24,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, rgba(79,163,199,0.16), rgba(159,211,234,0.18))",
    border: "1px solid rgba(79,163,199,0.20)",
    boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
  },

  logo: {
    width: 70,
    height: 70,
    objectFit: "contain",
    display: "block",
  },

  title: {
    margin: 0,
    color: "#1b5f7a",
    fontSize: 26,
    fontWeight: 900,
    letterSpacing: 0.2,
  },

  subtitle: {
    margin: "8px 0 18px",
    color: "#5f6b73",
    fontSize: 14,
    fontWeight: 600,
  },

  field: {
    textAlign: "left",
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: "#4b565d",
    marginBottom: 6,
    display: "block",
    fontWeight: 800,
  },

  input: {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.78)",
    fontSize: 14,
    outline: "none",
    transition: "0.15s ease",
  },

  button: {
    width: "100%",
    marginTop: 10,
    padding: "12px 14px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #1877F2, #5AA9FA)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 900,
    letterSpacing: 0.2,
    boxShadow: "0 14px 30px rgba(24, 119, 242, 0.25)",
    transition: "transform 0.12s ease, filter 0.12s ease",
    userSelect: "none",
  },

  buttonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  error: {
    color: "#d9534f",
    fontSize: 13,
    margin: "8px 0 2px",
    fontWeight: 800,
  },

  footer: {
    marginTop: 16,
    fontSize: 13,
    color: "#4b565d",
    fontWeight: 600,
  },

  link: {
    color: "#2d88ad",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: 900,
  },
};

export default Login;
