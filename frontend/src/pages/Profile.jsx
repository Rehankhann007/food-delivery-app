import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext";

export default function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");

    showToast("Logged out successfully", "success");
    navigate("/login");
  };

  if (!user) {
    return (
      <div
        className="flex justify-center items-center px-4 overflow-y-auto"
        style={{ background: "var(--bg-deep)", height: "calc(100vh - 80px)", maxHeight: "calc(100vh - 80px)" }}
      >
        <div className="glass-card fade-up in-view w-[350px] p-8 text-center my-auto">
          <h2 className="text-xl font-bold text-white mb-2">👤 Profile</h2>
          <p className="text-white/50 mb-5 text-sm">No user logged in</p>
          <button
            onClick={() => navigate("/login")}
            className="btn-glow w-full text-white py-2.5 rounded-xl font-medium"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center px-4 overflow-y-auto"
      style={{ background: "var(--bg-deep)", height: "calc(100vh - 80px)", maxHeight: "calc(100vh - 80px)" }}
    >
      <div className="glass-card fade-up in-view w-[350px] p-8 text-center my-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
          {user.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <h2 className="text-xl font-bold text-white mb-5">My profile</h2>

        <div className="text-left bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5 mb-6">
          <p className="text-sm text-white/70">
            <span className="text-white/40">Name: </span>
            {user.name || "N/A"}
          </p>
          <p className="text-sm text-white/70">
            <span className="text-white/40">Email: </span>
            {user.email || "N/A"}
          </p>
          <p className="text-sm text-white/70">
            <span className="text-white/40">Role: </span>
            {user.role || "user"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-2.5 rounded-xl font-semibold hover:scale-[1.02] transition-transform"
        >
          Logout
        </button>
      </div>
    </div>
  );
}