import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import OtpVerify from "./pages/OtpVerify";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";

function App() {
  // 🛒 Cart state (localStorage support)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 💾 Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <GoogleOAuthProvider clientId="514243762273-54r7kcibl5mjlg3imrnpqd0b0ch9tr1p.apps.googleusercontent.com">
      <BrowserRouter>
        {/* Navbar always visible */}
        <Navbar />

      <Routes>

        {/* 🏠 Home Page */}
        <Route
          path="/"
          element={<Home cart={cart} setCart={setCart} />}
        />

        {/* 🔐 Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* 🛒 Cart Checkout */}
        <Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout cart={cart} setCart={setCart} />
    </ProtectedRoute>
  }
/>

        {/* 📦 Orders */}
       <Route
  path="/orders"
  element={
    <ProtectedRoute>
      <MyOrders />
    </ProtectedRoute>
  }
/>

        {/* 🛠️ Admin Panel */}
        <Route path="/admin" element={<Admin />} />

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

<Route path="/verify-otp" element={<OtpVerify />} />

<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

      </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;