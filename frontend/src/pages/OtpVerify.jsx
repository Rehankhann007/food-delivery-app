import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext";

export default function OtpVerify() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white placeholder-white/30 p-3 rounded-xl mb-3 outline-none focus:border-orange-400/50 focus:shadow-[0_0_0_3px_rgba(255,94,58,0.15)] transition-all";

  const verifyOtp = async () => {
    setError("");

    if (!email || !otp) {
      setError("Please enter email and OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://food-delivery-app-e4by.onrender.com/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        showToast("OTP verified successfully 🎉", "success");
        navigate("/login");
      } else {
        setError(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.log(err);
      setError("Server error, please try again");
    }

    setLoading(false);
  };

  return (
    <div
      className="flex justify-center items-center px-4 overflow-y-auto"
      style={{ background: "var(--bg-deep)", height: "calc(100vh - 80px)", maxHeight: "calc(100vh - 80px)" }}
    >
      <div className="glass-card fade-up in-view w-[380px] p-8 text-center my-auto">
        <h2 className="text-2xl font-bold text-white mb-1">
          🔐 Verify your email
        </h2>
        <p className="text-sm text-white/50 mb-6">
          Enter the OTP sent to your email
        </p>

        <input
          className={inputClass}
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {error && <p className="field-error justify-center">⚠️ {error}</p>}

        <button
          onClick={verifyOtp}
          disabled={loading}
          className="btn-glow w-full text-white py-3 rounded-xl font-semibold mt-2 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p
          className="mt-4 text-orange-400 text-sm cursor-pointer hover:text-orange-300"
          onClick={() => showToast("Resend API needs to be added", "info")}
        >
          Resend OTP
        </p>
      </div>
    </div>
  );
}