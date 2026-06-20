import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    const res = await fetch(
      "http://localhost:5000/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setOtpSent(true);
      alert("OTP Sent");
    } else {
      alert(data.message);
    }
  };

  const resetPassword = async () => {
    const res = await fetch(
      "http://localhost:5000/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          password,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Password Reset Successful");
      navigate("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 rounded-lg mb-4"
        />

        {!otpSent ? (
          <button
            onClick={sendOtp}
            className="w-full bg-orange-500 text-white py-3 rounded-lg"
          >
            Send OTP
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              className="w-full border p-3 rounded-lg mb-4"
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border p-3 rounded-lg mb-4"
            />

            <button
              onClick={resetPassword}
              className="w-full bg-green-500 text-white py-3 rounded-lg"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}