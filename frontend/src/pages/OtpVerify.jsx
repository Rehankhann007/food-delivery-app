import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OtpVerify() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    if (!email || !otp) {
      alert("Please enter email and OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP Verified Successfully 🎉");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Verify Your Email</h2>
        <p style={styles.subtitle}>
          Enter OTP sent to your email
        </p>

        <input
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={verifyOtp}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p
          style={styles.link}
          onClick={() => alert("Resend API add karna hoga")}
        >
          Resend OTP
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    width: "380px",
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(15px)",
    color: "#fff",
    textAlign: "center",
    boxShadow: "0 0 25px rgba(0,0,0,0.4)",
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
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#ff4d2d",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
  link: {
    marginTop: "15px",
    color: "#ff4d2d",
    cursor: "pointer",
    fontSize: "14px",
  },
};