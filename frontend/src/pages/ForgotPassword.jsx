import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white placeholder-white/30 p-3 rounded-xl mb-4 outline-none focus:border-orange-400/50 focus:shadow-[0_0_0_3px_rgba(255,94,58,0.15)] transition-all";

  const sendOtp = async () => {
    const res = await fetch(
      "https://food-delivery-app-e4by.onrender.com/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setOtpSent(true);
    } else {
      alert(data.message);
    }
  };

  const resetPassword = async () => {
    const res = await fetch(
      "https://food-delivery-app-e4by.onrender.com/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      }
    );

    const data = await res.json();

    if (data.success) {
      navigate("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div
      className="flex justify-center items-center px-4 overflow-y-auto"
      style={{ background: "var(--bg-deep)", height: "calc(100vh - 80px)", maxHeight: "calc(100vh - 80px)" }}
    >
      <div className="glass-card fade-up in-view w-full max-w-md p-8 my-auto">
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent mb-6">
          Forgot password
        </h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />

        {!otpSent ? (
          <button
            onClick={sendOtp}
            className="btn-glow w-full text-white py-3 rounded-xl font-semibold"
          >
            Send OTP
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={inputClass}
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11 mb-0`}
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

            <button
              onClick={resetPassword}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition-transform"
            >
              Reset password
            </button>
          </>
        )}
      </div>
    </div>
  );
}