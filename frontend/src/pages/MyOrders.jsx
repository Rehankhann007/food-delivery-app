import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../components/ToastContext";

export default function MyOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://food-delivery-app-e4by.onrender.com/api/orders/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `https://food-delivery-app-e4by.onrender.com/api/orders/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        showToast("Order cancelled successfully", "success");
        fetchOrders();
      } else {
        showToast(res.data.message || "Failed to cancel order", "error");
      }
    } catch (err) {
      console.log(err);
      showToast("Failed to cancel order", "error");
    }
  };

  const statusStyles = {
    Pending: "bg-amber-400/15 text-amber-300",
    Preparing: "bg-blue-400/15 text-blue-300",
    "Out For Delivery": "bg-orange-400/15 text-orange-300",
    Delivered: "bg-emerald-400/15 text-emerald-300",
    Cancelled: "bg-red-400/15 text-red-300",
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-deep)" }}
      >
        <h2 className="text-white/60 text-lg">Loading orders...</h2>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 sm:px-6 py-10"
      style={{ background: "var(--bg-deep)" }}
    >
      <h1 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
        📦 My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="glass-card max-w-md mx-auto p-10 text-center fade-up in-view">
          <h2 className="text-white text-xl font-semibold mb-2">
            No orders yet 😢
          </h2>
          <p className="text-white/50 text-sm">
            Order your favourite food now!
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-card fade-up in-view p-5"
            >
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-white/40">Order ID</span>
                <strong className="text-white">
                  #{order._id.slice(-6)}
                </strong>
              </div>

              <div className="mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusStyles[order.status] || "bg-white/10 text-white/70"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="border-t border-b border-white/10 py-3 space-y-1.5">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-white/70"
                  >
                    <span>
                      {item.name}
                      {item.qty ? ` x ${item.qty}` : ""}
                    </span>
                    <span>₹{item.price * (item.qty || 1)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4 text-base">
                <strong className="text-white">Total</strong>
                <strong className="text-orange-400">
                  ₹{order.totalAmount}
                </strong>
              </div>

              <p className="mt-3 text-xs text-white/30">
                {new Date(order.createdAt).toLocaleString()}
              </p>

              {order.status !== "Delivered" &&
                order.status !== "Cancelled" && (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="mt-4 w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-2.5 rounded-xl font-semibold hover:scale-[1.02] transition-transform"
                  >
                    Cancel order
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}