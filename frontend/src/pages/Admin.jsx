import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function Admin() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});

  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://food-delivery-app-e4by.onrender.com/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://food-delivery-app-e4by.onrender.com/api/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Status Updated Successfully");
      fetchOrders();
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (acc, order) => acc + Number(order.totalAmount || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f59e0b";
      case "Preparing":
        return "#3b82f6";
      case "Out For Delivery":
        return "#f97316";
      case "Delivered":
        return "#22c55e";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      style={{
        padding: "25px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: "25px",
          textAlign: "center",
        }}
      >
        👨‍💼 Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>📦 Total Orders</h3>
          <h1>{totalOrders}</h1>
        </div>

        <div style={cardStyle}>
          <h3>💰 Revenue</h3>
          <h1>₹{totalRevenue}</h1>
        </div>

        <div style={cardStyle}>
          <h3>🟡 Pending</h3>
          <h1>{pendingOrders}</h1>
        </div>

        <div style={cardStyle}>
          <h3>🟢 Delivered</h3>
          <h1>{deliveredOrders}</h1>
        </div>
      </div>

      {/* Orders */}
      <h2 style={{ marginBottom: "20px" }}>
        📋 All Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3>
                Order #{order._id.slice(-6)}
              </h3>

              <p>
                User ID: {order.userId}
              </p>

            <p>
  <strong>Name:</strong>{" "}
  {order.customerName}
</p>

<p>
  <strong>Mobile:</strong>{" "}
  {order.mobileNumber}
</p>

<p>
  <strong>Address:</strong>{" "}
  {order.address}
</p>
              <p>
                Total: ₹
                {order.totalAmount}
              </p>

              <p>
                Status:
                <span
                  style={{
                    marginLeft: "10px",
                    color: getStatusColor(
                      order.status
                    ),
                    fontWeight: "bold",
                  }}
                >
                  {order.status}
                </span>
              </p>
            </div>

            <div>
              <select
                value={
                  selectedStatus[
                    order._id
                  ] || order.status
                }
                onChange={(e) =>
                  setSelectedStatus({
                    ...selectedStatus,
                    [order._id]:
                      e.target.value,
                  })
                }
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                }}
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Preparing">
                  Preparing
                </option>

                <option value="Out For Delivery">
                  Out For Delivery
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>

              <button
                onClick={() =>
                  updateStatus(
                    order._id,
                    selectedStatus[
                      order._id
                    ] || order.status
                  )
                }
                style={{
                  marginLeft: "10px",
                  background:
                    "#ff6b35",
                  color: "#fff",
                  border: "none",
                  padding:
                    "8px 15px",
                  borderRadius:
                    "6px",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
            </div>
          </div>

          <hr
            style={{
              margin: "15px 0",
            }}
          />

          <h4>🍔 Ordered Items</h4>

          {order.items.map(
            (item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  padding:
                    "5px 0",
                }}
              >
                <span>
                  {item.name}
                </span>

                <span>
                  ₹{item.price}
                </span>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.1)",
};