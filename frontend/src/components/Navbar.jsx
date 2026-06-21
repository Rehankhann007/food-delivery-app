import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount = cart.reduce(
    (total, item) => total + (item.qty || 1),
    0
  );

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-orange-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold"
        >
          🍔 BiteMeNow
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          {token && (
            <span className="font-semibold">
              Hi, {user?.name}
            </span>
          )}

          <Link to="/">Home</Link>

          {!token ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : (
            <>
              <Link
                to="/checkout"
                className="relative"
              >
                <FaShoppingCart size={22} />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to="/orders">
                My Orders
              </Link>

              <Link to="/profile">
                Profile
              </Link>

              {isAdmin && (
                <Link to="/admin">
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-white text-orange-500 px-3 py-1 rounded-lg font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          {menuOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-orange-600 px-4 py-3 flex flex-col gap-4">
          {token && (
            <span className="font-semibold">
              Hi, {user?.name}
            </span>
          )}

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {!token ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/checkout"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <FaShoppingCart />
                Cart ({cartCount})
              </Link>

              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
              >
                My Orders
              </Link>

              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-white text-orange-500 px-3 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;