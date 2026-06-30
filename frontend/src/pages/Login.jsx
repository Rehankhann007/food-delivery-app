import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "../components/ToastContext";

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
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

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        showToast("Login successful 🎉", "success");
        navigate("/");
        window.location.reload();
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      setError(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* LEFT BRANDING PANEL */}
      <div className="auth-brand">
        <img
          className="auth-brand-image"
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=70&auto=format&fit=crop"
          alt=""
        />
        <div className="auth-brand-overlay"></div>

        <div className="auth-brand-content">
          <span className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            🍔 BiteMeNow
          </span>

          <h1 className="text-4xl font-extrabold text-white mt-8 leading-tight max-w-md">
            Good food,
            <br />
            delivered with love.
          </h1>

          <p className="text-white/50 mt-4 max-w-sm">
            Order from your favourite restaurants and get it delivered to
            your doorstep in minutes.
          </p>

          <div className="flex gap-3 mt-10 flex-wrap">
            <span className="auth-stat-pill">⭐ 4.8 average rating</span>
            <span className="auth-stat-pill">🚚 25 min avg delivery</span>
          </div>
        </div>
      </div>

      {/* RIGHT FORM SIDE */}
      <div className="auth-form-side">
        <div className="glow-bg">
          <div className="glow-blob b1"></div>
          <div className="glow-blob b2"></div>
        </div>

        <div className="glass-card fade-up in-view w-full max-w-md p-7 relative z-10 my-auto">
          <h2 className="text-2xl font-extrabold text-white mb-1">
            Welcome back
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Login to continue ordering
          </p>

          <label className="text-xs font-medium text-white/40 mb-1.5 block">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input mb-3.5"
          />

          <label className="text-xs font-medium text-white/40 mb-1.5 block">
            Password
          </label>
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-orange-400 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>

          {error && <p className="field-error">⚠️ {error}</p>}

          <p
            className="text-right text-orange-400 hover:text-orange-300 cursor-pointer mb-4 text-sm"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-glow w-full text-white py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-4 mb-1 text-white/50 text-sm">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-orange-400 font-semibold cursor-pointer hover:text-orange-300"
            >
              Sign up
            </span>
          </p>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="text-white/30 text-xs uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              size="large"
              shape="pill"
              width="350"
              onSuccess={async (credentialResponse) => {
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

                    showToast("Login successful 🎉", "success");
                    navigate("/");
                    window.location.reload();
                  }
                } catch (err) {
                  console.log("GOOGLE ERROR:", err);
                  setError(err?.message || "Google login failed");
                }
              }}
              onError={() => {
                setError("Google sign-in failed");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}