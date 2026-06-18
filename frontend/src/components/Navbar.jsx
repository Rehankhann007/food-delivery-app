import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const cart = JSON.parse(
  localStorage.getItem("cart")
) || [];

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
    <nav className="bg-orange-500 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link
          to="/"
          className="text-2xl font-bold"
        >
          🍔 BiteMeNow
        </Link>

        <div className="flex items-center gap-5">
          {token && (
            <span className="font-semibold">
              Welcome, {user?.name}
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
              <Link to="/checkout" className="relative text-xl">
  <FaShoppingCart size={22} />

  {cartCount > 0 && (
    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full text-center">
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
                className="bg-white text-orange-500 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;