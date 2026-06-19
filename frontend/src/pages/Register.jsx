import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  // SEND OTP
  const sendOtp = async () => {
    try {
      const res = await fetch(
        "https://food-delivery-app-e4by.onrender.com/api/auth/send-otp",
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
        alert("OTP Sent Successfully");
        setOtpSent(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  // VERIFY OTP + CREATE ACCOUNT
  const verifyOtp = async () => {
    try {
      const res = await fetch(
        "https://food-delivery-app-e4by.onrender.com/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Account Created Successfully");

        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
  <div className="min-h-screen flex justify-center items-center bg-gray-100">
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
        Create Account
      </h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-3 rounded-lg mb-4"
      />

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3 rounded-lg mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-3 rounded-lg mb-4"
      />

      {!otpSent ? (
        <button
          onClick={sendOtp}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
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
            className="w-full border p-3 rounded-lg mb-4"
          />

          <button
            onClick={verifyOtp}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
          >
            Verify OTP & Create Account
          </button>
        </>
      )}

      <p className="text-center mt-5 text-gray-600">
        Already have an account?{" "}
        <span
          className="text-orange-500 cursor-pointer font-semibold"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  </div>
);
}

export default Register;