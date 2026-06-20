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
  "http://localhost:5000/api/orders/my-orders",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

console.log("MY ORDERS DATA:", res.data);

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
        `http://localhost:5000/api/orders/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Order Cancelled Successfully");
        fetchOrders();
      }
    } catch (err) {
      console.log(err);
      alert("Cancel Failed");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          background: "#FEF3C7",
          color: "#D97706",
        };

      case "Preparing":
        return {
          background: "#DBEAFE",
          color: "#2563EB",
        };

      case "Out For Delivery":
        return {
          background: "#FED7AA",
          color: "#EA580C",
        };

      case "Delivered":
        return {
          background: "#DCFCE7",
          color: "#16A34A",
        };

      case "Cancelled":
        return {
          background: "#FEE2E2",
          color: "#DC2626",
        };

      default:
        return {
          background: "#eee",
          color: "#000",
        };
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading Orders...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        📦 My Orders
      </h1>

      {orders.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "15px",
            textAlign: "center",
          }}
        >
          <h2>No Orders Yet 😢</h2>
          <p>Order your favourite food now!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(320px,1fr))",
            gap: "20px",
          }}
        >
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "#fff",
                borderRadius: "15px",
                padding: "18px",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span>Order ID</span>

                <strong>
                  #{order._id.slice(-6)}
                </strong>
              </div>

              {/* Status */}
              <div style={{ marginBottom: "15px" }}>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "30px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    ...getStatusStyle(order.status),
                  }}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div
                style={{
                  borderTop: "1px solid #eee",
                  borderBottom: "1px solid #eee",
                  padding: "12px 0",
                }}
              >
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 0",
                    }}
                  >
                    <span>
                      {item.name}
                      {item.qty
                        ? ` x ${item.qty}`
                        : ""}
                    </span>

                    <span>
                      ₹
                      {item.price *
                        (item.qty || 1)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "12px",
                  fontSize: "16px",
                }}
              >
                <strong>Total</strong>

                <strong>
                  ₹{order.totalAmount}
                </strong>
              </div>

              {/* Date */}
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>

              {/* Cancel Button */}
              {order.status !== "Delivered" &&
                order.status !==
                  "Cancelled" && (
                  <button
                    onClick={() =>
                      cancelOrder(order._id)
                    }
                    style={{
                      marginTop: "15px",
                      width: "100%",
                      padding: "10px",
                      border: "none",
                      borderRadius: "8px",
                      background:
                        "#ef4444",
                      color: "#fff",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Cancel Order
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}