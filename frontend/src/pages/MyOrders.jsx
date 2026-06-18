import { useEffect, useState } from "react";
import axios from "axios";

export default function MyOrders() {
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Order Cancelled");
        fetchOrders();
      }
    } catch (err) {
      console.log(err);
      alert("Cancel failed");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📦 My Orders</h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div style={styles.emptyBox}>
          <h3>No Orders Yet 😢</h3>
          <p>Order your favorite food now!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              
              {/* Header */}
              <div style={styles.cardHeader}>
                <span>Order ID</span>
                <span style={styles.idText}>
                  #{order._id.slice(-6)}
                </span>
              </div>

              {/* Status */}
              <div style={styles.statusRow}>
                <span style={styles.status}>
                  {order.status || "Processing"}
                </span>
              </div>

              {/* Items */}
              <div style={styles.items}>
                {order.items.map((item, index) => (
                  <div key={index} style={styles.itemRow}>
                    <span>{item.name}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={styles.total}>
                <strong>Total:</strong>
                <strong>₹{order.totalAmount}</strong>
              </div>

              {/* ✅ CANCEL BUTTON (INSIDE CARD) */}
              <button
                onClick={() => cancelOrder(order._id)}
                style={styles.cancelBtn}
              >
                Cancel Order
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    background: "#f6f6f6",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "14px",
    color: "gray",
  },
  idText: {
    fontWeight: "bold",
    color: "#000",
  },
  statusRow: {
    marginBottom: "10px",
  },
  status: {
    padding: "5px 10px",
    background: "#ffedd5",
    color: "#ff4d2d",
    borderRadius: "20px",
    fontSize: "12px",
  },
  items: {
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
    padding: "10px 0",
    marginBottom: "10px",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    padding: "3px 0",
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
  },
  emptyBox: {
    textAlign: "center",
    padding: "40px",
    background: "#fff",
    borderRadius: "12px",
  },
  cancelBtn: {
  marginTop: "10px",
  width: "100%",
  padding: "8px",
  background: "#ff4d2d",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
},
};

