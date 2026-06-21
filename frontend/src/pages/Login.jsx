import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(
        "https://food-delivery-app-e4by.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
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

        alert("Login Successful");

        navigate("/");
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
  console.log("LOGIN ERROR:", error);

  alert(
    error?.message ||
    JSON.stringify(error)
  );
}
  };

 

  return (
  <div className="mt-10 flex items-center justify-center from-orange-50 to-orange-100 px-4 overflow-hidden">
    
    <div className="bg-white w-full max-w-md p-5 md:p-7 rounded-2xl shadow-2xl">

      {/* Logo */}
      <div className="text-center mb-6">
        <h1 className="text-5xl mb-2">🍔</h1>

        <h2 className="text-3xl font-bold text-orange-500">
          Welcome Back
        </h2>

        <p className="text-gray-500 mt-2 text-sm">
          Login to continue ordering delicious food
        </p>
      </div>

      {/* Email */}
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      {/* Forgot Password */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/forgot-password")}
          className="text-orange-500 hover:cursor-pointer text-sm hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="w-full bg-orange-500 hover:cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition duration-300"
      >
        Login
      </button>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-300"></div>

        <span className="px-3 text-gray-400 text-sm">
          OR
        </span>

        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Google Login */}
      <div className="flex justify-center mb-5 overflow-hidden">
        <GoogleLogin
          size="large"
          shape="pill"
          width="300"
          onSuccess={async (credentialResponse) => {
            try {
              const res = await fetch(
                "https://food-delivery-app-e4by.onrender.com/api/auth/google",
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  body: JSON.stringify({
                    token:
                      credentialResponse.credential,
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

                navigate("/");
                window.location.reload();
              }
            } catch (err) {
              alert("Google Login Failed");
            }
          }}
          onError={() => {
            alert("Google Login Failed");
          }}
        />
      </div>

      {/* Signup */}
      <p className="text-center text-gray-600 text-sm">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-orange-500 font-semibold cursor-pointer hover:underline"
        >
          Sign Up
        </span>
      </p>
    </div>
  </div>
);
}