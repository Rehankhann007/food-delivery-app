import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");

    alert("Logged out successfully");
    navigate("/login");
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>👤 Profile</h2>
          <p>No user logged in</p>
          <button style={styles.button} onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>👤 My Profile</h2>

        <div style={styles.infoBox}>
          <p><b>Name:</b> {user.name || "N/A"}</p>
          <p><b>Email:</b> {user.email || "N/A"}</p>
          <p><b>Role:</b> {user.role || "user"}</p>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    background: "#f5f5f5",
  },
  card: {
    width: "350px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  infoBox: {
    textAlign: "left",
    marginTop: "15px",
    marginBottom: "20px",
    padding: "10px",
    background: "#f9f9f9",
    borderRadius: "8px",
  },
  logoutBtn: {
    width: "100%",
    padding: "10px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  button: {
    padding: "10px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};