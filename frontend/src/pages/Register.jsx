import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= REGISTER =================
  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://food-delivery-app-e4by.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("OTP sent to your email 📩");

        // OTP page redirect
        navigate("/verify-otp", {
          state: { email },
        });
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }

    setLoading(false);
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(
        "https://food-delivery-app-e4by.onrender.com/api/auth/google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        }
      );

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Google Login Success 🎉");
        navigate("/");
      } else {
        alert("Google Login Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🍕 Create Account</h2>
        <p style={styles.subtitle}>Join & order delicious food</p>

        {/* NAME */}
        <input
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* EMAIL */}
        <input
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          style={styles.input}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* SIGNUP BUTTON */}
        <button
          onClick={handleRegister}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* GOOGLE LOGIN */}
        <div style={{ marginTop: "15px" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google Login Failed")}
          />
        </div>

        {/* LOGIN LINK */}
        <p style={styles.text}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#0f172a,#1e293b)",
  },
  card: {
    width: "380px",
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    marginBottom: "5px",
    fontSize: "24px",
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
    border: "1px solid rgba(255,255,255,0.2)",
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