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
    <div className=" flex justify-center items-center">
      <div className="bg-white mt-40 p-8 rounded-xl shadow-2xl w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
          Login
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

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button
          onClick={handleLogin}
          className="w-full hover:cursor-pointer bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
        >
          Login
        </button>

        <p
  className="text-right text-orange-500 cursor-pointer mb-4"
  onClick={() =>
    navigate("/forgot-password")
  }
>
  Forgot Password?
</p>

        <p className="text-center hover:cursor-pointer mt-5 mb-5 text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() =>
              navigate("/signup")
            }
            className="text-orange-500 font-semibold cursor-pointer"
          >
            Sign Up
          </span>
        </p>

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
  console.log("GOOGLE ERROR:", err);

  alert(
    err?.message ||
    JSON.stringify(err)
  );
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