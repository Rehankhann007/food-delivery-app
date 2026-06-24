import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaSearch } from "react-icons/fa";

function Navbar({ cart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const cartCount = cart.reduce((total, item) => total + (item.qty || 1), 0);

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const goToSearch = () => {
    if (!searchValue.trim()) {
      navigate("/menu");
      return;
    }
    navigate(`/menu?search=${encodeURIComponent(searchValue.trim())}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      goToSearch();
      setMenuOpen(false);
    }
  };

  const NavLink = ({ to, children }) => {
    const active = location.pathname === to;
    return (
      <Link to={to} className="relative font-medium text-sm py-2 group">
        <span
          className={
            active
              ? "text-white"
              : "text-white/60 group-hover:text-white transition-colors"
          }
        >
          {children}
        </span>
        <span
          className={`absolute left-0 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-300 ${
            active ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </Link>
    );
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10" : "border-b border-white/[0.03]"
      }`}
      style={{
        background: scrolled ? "rgba(7, 7, 11, 0.85)" : "rgba(7, 7, 11, 0.5)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: scrolled ? "0 8px 32px -8px rgba(0,0,0,0.5)" : "none",
      }}
    >
      {/* glowing accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,94,58,0.5), rgba(255,45,117,0.5), transparent)",
          opacity: scrolled ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      ></div>

      <div
        className={`max-w-7xl mx-auto px-6 flex justify-between items-center gap-4 transition-all duration-300 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <span className="text-2xl group-hover:rotate-12 inline-block transition-transform duration-300">
            🍔
          </span>
          <span className="hidden sm:inline text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            BiteMeNow
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-7 flex-shrink-0">
          {token && <NavLink to="/">Home</NavLink>}
          {token && <NavLink to="/menu">Menu</NavLink>}
          {token && (
            <>
              <NavLink to="/orders">Orders</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              {isAdmin && <NavLink to="/admin">Admin</NavLink>}
            </>
          )}
        </div>

        {/* Search bar (desktop, logged-in only) */}
        {token && (
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <FaSearch
              size={13}
              className="absolute left-3.5 text-white/30 pointer-events-none"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search dishes..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm pl-9 pr-3 py-2 rounded-full outline-none focus:border-orange-400/50 focus:shadow-[0_0_0_3px_rgba(255,94,58,0.12)] transition-all"
            />
          </div>
        )}

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          {token && (
            <>
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full pl-1.5 pr-3.5 py-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-[11px] font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm text-white/70">{user?.name}</span>
              </div>

              <Link
                to="/checkout"
                className="relative bg-white/5 border border-white/10 p-3 rounded-full hover:border-orange-400/40 hover:shadow-[0_0_16px_rgba(255,94,58,0.35)] hover:-translate-y-0.5 transition-all"
              >
                <FaShoppingCart size={18} className="text-orange-400" />

                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-semibold badge-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="btn-glow px-5 py-2 rounded-xl text-white font-medium text-sm"
              >
                Logout
              </button>
            </>
          )}

          {!token && (
            <>
              <Link
                to="/login"
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="btn-glow px-5 py-2 rounded-xl text-white font-medium text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl text-orange-400 w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 flex-shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/5"
        style={{
          maxHeight: menuOpen ? "560px" : "0px",
          background: "rgba(7, 7, 11, 0.97)",
        }}
      >
        <div className="px-6 py-5 space-y-4">
          {token && (
            <>
              <div className="flex items-center gap-2.5 pb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <p className="font-semibold text-white">{user?.name}</p>
              </div>

              {/* Search bar (mobile) */}
              <div className="relative">
                <FaSearch
                  size={13}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search dishes..."
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm pl-9 pr-3 py-2.5 rounded-full outline-none focus:border-orange-400/50"
                />
              </div>
            </>
          )}

          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-white/80">
            Home
          </Link>

          {token && (
            <Link to="/menu" onClick={() => setMenuOpen(false)} className="block text-white/80">
              Menu
            </Link>
          )}

          {token ? (
            <>
              <Link to="/checkout" onClick={() => setMenuOpen(false)} className="block text-white/80">
                Cart ({cartCount})
              </Link>

              <Link to="/orders" onClick={() => setMenuOpen(false)} className="block text-white/80">
                Orders
              </Link>

              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block text-white/80">
                Profile
              </Link>

              {isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-white/80">
                  Admin
                </Link>
              )}

              <button onClick={handleLogout} className="btn-glow w-full text-white py-3 rounded-xl">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-white/80">
                Login
              </Link>

              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block text-white/80">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;