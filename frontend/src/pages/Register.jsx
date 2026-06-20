import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

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
        "http://localhost:5000/api/auth/send-otp",
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

// resend OTP
const resendOtp = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/auth/resend-otp",
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
      alert("New OTP Sent");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  }
};

  // VERIFY OTP + CREATE ACCOUNT
  const verifyOtp = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
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

        {otpSent && (
  <>
    

    <button
      onClick={verifyOtp}
      className="w-full bg-green-500 text-white py-3 rounded-lg mb-3"
    >
      Verify OTP
    </button>

    <button
      onClick={resendOtp}
      className="w-full bg-blue-500 text-white py-3 rounded-lg"
    >
      Resend OTP
    </button>
  </>
)}

          
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

<div className="my-5 flex items-center">
  <div className="flex-1 border-t"></div>
  <span className="px-3 text-gray-500">
    OR
  </span>
  <div className="flex-1 border-t"></div>
</div>

<div className="flex justify-center">
  <GoogleLogin
    size="large"
    shape="pill"
    width="350"
    onSuccess={async (credentialResponse) => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/auth/google",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: credentialResponse.credential,
            }),
          }
        );

        const data = await res.json();

        if (data.token) {
          localStorage.setItem(
            "token",
            data.token
          );

          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          alert(
            "Google Account Created Successfully"
          );

          navigate("/");
          window.location.reload();
        }
      } catch (err) {
        console.log(err);
        alert("Google Signup Failed");
      }
    }}
    onError={() => {
      alert("Google Signup Failed");
    }}
  />
</div>

    </div>
  </div>
);
}

export default Register;