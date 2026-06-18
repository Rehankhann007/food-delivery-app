import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://food-delivery-app-e4by.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      // ❌ OTP NOT VERIFIED CASE
      if (data.message === "Please verify your email first") {
        alert("⚠️ Please verify your email first");

        navigate("/verify-otp", {
          state: { email },
        });

        return;
      }

      // ❌ INVALID LOGIN
      if (!data.token) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ SUCCESS LOGIN
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login Successful 🎉");
      navigate("/");

    } catch (err) {
      console.log(err);
      alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 🍔</h2>
        <p style={styles.subtitle}>Login to order your favorite food</p>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          style={styles.input}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.text}>
          New here?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={styles.link}
          >
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  bg: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    width: "360px",
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 0 30px rgba(0,0,0,0.4)",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "13px",
    opacity: 0.7,
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#ff4d2d",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  text: {
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#ff4d2d",
    cursor: "pointer",
    fontWeight: "bold",
  },
};