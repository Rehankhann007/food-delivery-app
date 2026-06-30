import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext";

export default function Checkout({ cart, setCart }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [address, setAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const token = localStorage.getItem("token");

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white placeholder-white/30 p-3 rounded-xl mb-3 outline-none focus:border-orange-400/50 focus:shadow-[0_0_0_3px_rgba(255,94,58,0.15)] transition-all";

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQty = (i) => {
    const newCart = [...cart];
    newCart[i].qty = (newCart[i].qty || 1) + 1;
    updateCart(newCart);
  };

  const decreaseQty = (i) => {
    const newCart = [...cart];
    newCart[i].qty = (newCart[i].qty || 1) - 1;

    if (newCart[i].qty <= 0) newCart.splice(i, 1);
    updateCart(newCart);
  };

  const removeItem = (i) => {
    updateCart(cart.filter((_, index) => index !== i));
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  const placeOrder = async () => {
    setError("");

    if (!customerName) return setError("Please enter your name");
    if (!mobileNumber) return setError("Please enter your mobile number");
    if (!address) return setError("Please enter a delivery address");
    if (!token) return setError("Please login to place an order");

    setPlacing(true);

    try {
      const res = await fetch(
        "https://food-delivery-app-e4by.onrender.com/api/orders/place",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerName,
            mobileNumber,
            items: cart,
            totalAmount: Number(total),
            address,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        showToast("Order placed successfully 🍔", "success");
        setCart([]);
        localStorage.removeItem("cart");
        navigate("/orders");
      } else {
        setError(data.message || "Failed to place order");
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong, please try again");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div
      className="min-h-screen px-4 sm:px-6 py-10"
      style={{ background: "var(--bg-deep)" }}
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="md:col-span-2 glass-card fade-up in-view p-6">
          <h2 className="text-2xl font-bold text-white mb-5">Your cart 🛒</h2>

          {cart.length === 0 ? (
            <div className="text-center py-14">
              <h3 className="text-white/70 text-lg mb-4">
                No items found 😢
              </h3>
              <button
                onClick={() => navigate("/")}
                className="btn-glow text-white px-6 py-2.5 rounded-xl font-medium"
              >
                Go shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {item.name}
                    </h3>
                    <p className="text-white/40 text-sm">₹{item.price}</p>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                    <button
                      onClick={() => decreaseQty(i)}
                      className="text-white/70 hover:text-orange-400 w-6 h-6"
                    >
                      −
                    </button>
                    <span className="text-white text-sm w-5 text-center">
                      {item.qty || 1}
                    </span>
                    <button
                      onClick={() => increaseQty(i)}
                      className="text-white/70 hover:text-orange-400 w-6 h-6"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(i)}
                    className="text-red-400 hover:text-red-300 text-lg px-1"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="glass-card fade-up in-view p-6 h-fit">
          <h2 className="text-xl font-bold text-white mb-4">
            Order summary
          </h2>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
            <p className="text-white/50 text-sm mb-1">Items: {cart.length}</p>
            <h3 className="text-2xl font-bold text-orange-400">
              Total: ₹{total}
            </h3>
          </div>

          <input
            type="text"
            placeholder="Enter full name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Enter mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className={inputClass}
          />

          <textarea
            placeholder="Enter delivery address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`${inputClass} h-24 resize-none`}
          />

          {error && <p className="field-error">⚠️ {error}</p>}

          <button
            onClick={placeOrder}
            disabled={placing}
            className="btn-glow w-full text-white py-3 rounded-xl font-semibold mt-1 disabled:opacity-60"
          >
            {placing ? "Placing order..." : "Place order 🍔"}
          </button>
        </div>
      </div>
    </div>
  );
}