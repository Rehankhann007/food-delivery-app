import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("https://food-delivery-app-e4by.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } else {
      alert(data.message);
    }
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

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        <p style={styles.text}>
          New here?{" "}
          <span onClick={() => navigate("/signup")} style={styles.link}>
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    animation: "fadeIn 1s ease-in-out",
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
    transform: "translateY(0)",
    animation: "float 3s ease-in-out infinite",
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
    transition: "0.3s",
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