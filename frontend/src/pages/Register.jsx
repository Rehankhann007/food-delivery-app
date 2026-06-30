import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "../components/ToastContext";

function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        "https://food-delivery-app-e4by.onrender.com/api/auth/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.success) {
        showToast("OTP sent successfully 📩", "success");
        setOtpSent(true);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.log(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setError("");
    try {
      const res = await fetch(
        "https://food-delivery-app-e4by.onrender.com/api/auth/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (data.success) {
        showToast("New OTP sent 📩", "success");
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.log(err);
      setError(err?.message || "Something went wrong");
    }
  };

  const verifyOtp = async () => {
    setError("");
    try {
      const res = await fetch(
        "https://food-delivery-app-e4by.onrender.com/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, otp }),
        }
      );

      const data = await res.json();

      if (data.success) {
        showToast("Account created successfully 🎉", "success");
        navigate("/login");
      } else {
        setError(data.message || "OTP verification failed");
      }
    } catch (error) {
      console.log(error);
      setError("Server error, please try again");
    }
  };

  return (
    <div className="auth-shell">
      {/* LEFT BRANDING PANEL */}
      <div className="auth-brand">
        <img
          className="auth-brand-image"
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=70&auto=format&fit=crop"
          alt=""
        />
        <div className="auth-brand-overlay"></div>

        <div className="auth-brand-content">
          <span className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            🍔 BiteMeNow
          </span>

          <h1 className="text-4xl font-extrabold text-white mt-8 leading-tight max-w-md">
            Join thousands
            <br />
            ordering smarter.
          </h1>

          <p className="text-white/50 mt-4 max-w-sm">
            Create your account and unlock exclusive deals, faster checkout,
            and order tracking.
          </p>

          <div className="flex gap-3 mt-10 flex-wrap">
            <span className="auth-stat-pill">🎉 New user offers</span>
            <span className="auth-stat-pill">🔒 Secure checkout</span>
          </div>
        </div>
      </div>

      {/* RIGHT FORM SIDE */}
      <div className="auth-form-side">
        <div className="glow-bg">
          <div className="glow-blob b1"></div>
          <div className="glow-blob b3"></div>
        </div>

        <div className="glass-card fade-up in-view w-full max-w-md p-7 relative z-10 my-auto">
          <h2 className="text-2xl font-extrabold text-white mb-1">
            Create account
          </h2>
          <p className="text-white/40 text-sm mb-5">
            Sign up to start ordering
          </p>

          <label className="text-xs font-medium text-white/40 mb-1.5 block">
            Full name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input mb-3"
          />

          <label className="text-xs font-medium text-white/40 mb-1.5 block">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input mb-3"
          />

          <label className="text-xs font-medium text-white/40 mb-1.5 block">
            Password
          </label>
          <div className="relative mb-4">
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

          {!otpSent ? (
            <button
              onClick={sendOtp}
              disabled={loading}
              className="btn-glow w-full text-white py-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <>
              <label className="text-xs font-medium text-white/40 mb-1.5 block">
                OTP
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="auth-input mb-3"
              />

              <button
                onClick={verifyOtp}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-semibold mb-2.5 hover:scale-[1.02] transition-transform"
              >
                Verify OTP
              </button>

              <button
                onClick={resendOtp}
                className="w-full bg-white/5 border border-white/10 text-white/80 py-2.5 rounded-xl hover:bg-white/10 transition"
              >
                Resend OTP
              </button>
            </>
          )}

          <p className="text-center mt-5 text-white/50 text-sm">
            Already have an account?{" "}
            <span
              className="text-orange-400 cursor-pointer font-semibold hover:text-orange-300"
              onClick={() => navigate("/login")}
            >
              Login
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
                    showToast("Google account created 🎉", "success");
                    navigate("/");
                    window.location.reload();
                  }
                } catch (err) {
                  console.log(err);
                  setError("Google signup failed");
                }
              }}
              onError={() => {
                setError("Google signup failed");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;