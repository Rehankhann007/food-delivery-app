import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { FaMoon, FaSun } from "react-icons/fa";

function Navbar({ cart, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));


  const cartCount = cart.reduce(
    (total, item) => total + (item.qty || 1),
    0
  );

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

    {/* Logo */}
    <Link
      to="/"
      className="text-3xl font-extrabold bg-linear-to-b from-orange-500 to-red-500 bg-clip-text text-transparent"
    >
      🍔 BiteMeNow
    </Link>

    {/* Desktop Menu */}
    <div className="hidden md:flex items-center gap-8">

      {token && (
  <Link
    to="/"
    className="font-medium text-gray-700 hover:text-orange-500 transition"
  >
    Home
  </Link>
)}
    {token && (
  <Link
    to="/menu"
    className="font-medium text-gray-700 hover:text-orange-500 transition"
  >
    Menu
  </Link>
)}

      {token && (
        <>
          <Link
            to="/orders"
            className="font-medium text-gray-700 hover:text-orange-500 transition"
          >
            Orders
          </Link>

          <Link
            to="/profile"
            className="font-medium text-gray-700 hover:text-orange-500 transition"
          >
            Profile
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="font-medium text-gray-700 hover:text-orange-500 transition"
            >
              Admin
            </Link>
          )}
        </>
      )}
    </div>

    {/* Right Side */}
    <div className="hidden md:flex items-center gap-5">

      {token && (
        <>
          <span className="text-sm font-medium text-gray-600">
            Hi, <span className="text-black">{user?.name}</span>
          </span>

          <Link
            to="/checkout"
            className="relative bg-orange-50 p-3 rounded-full hover:bg-orange-100 transition"
          >
            <FaShoppingCart
              size={22}
              className="text-orange-500"
            />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className="bg-linear-to-b from-orange-500 to-red-500 px-5 py-2 rounded-xl text-white font-medium hover:scale-105 transition"
          >
            Logout
          </button>
        </>
      )}

      {!token && (
        <>
          <Link
            to="/login"
            className="text-gray-700 hover:text-orange-500"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-linear-to-b from-orange-500 to-red-500 px-5 py-2 rounded-xl text-white"
          >
            Sign Up
          </Link>
        </>
      )}

      
    </div>

    {/* Mobile Button */}
    <button
      className="md:hidden text-2xl text-orange-500"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      {menuOpen ? <FaTimes /> : <FaBars />}
    </button>
  </div>

  {/* Mobile Menu */}
  {menuOpen && (
    <div className="md:hidden bg-white border-t border-gray-200 px-6 py-5 space-y-4 shadow-lg">

      {token && (
        <p className="font-semibold text-gray-700">
          Hi, {user?.name}
        </p>
      )}

      <Link
        to="/"
        onClick={() => setMenuOpen(false)}
        className="block"
      >
        Home
      </Link>

      {token && (
  <Link
    to="/menu"
    onClick={() => setMenuOpen(false)}
    className="block"
  >
    Menu
  </Link>
)}

      {token ? (
        <>
          <Link
            to="/checkout"
            onClick={() => setMenuOpen(false)}
            className="block"
          >
            Cart ({cartCount})
          </Link>

          <Link
            to="/orders"
            onClick={() => setMenuOpen(false)}
            className="block"
          >
            Orders
          </Link>

          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="block"
          >
            Profile
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              Admin
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full bg-linear-to-b from-orange-500 to-red-500 text-white py-3 rounded-xl"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block"
          >
            Login
          </Link>

          <Link
            to="/signup"
            onClick={() => setMenuOpen(false)}
            className="block"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  )}
</nav>
  );
}

export default Navbar;