import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const token = localStorage.getItem("token");

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
    if (!address) return alert("Enter address");
    if (!token) return alert("Login required");

    const res = await fetch("http://localhost:5000/api/orders/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cart,
        totalAmount: Number(total),
        address,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Order Placed 🍔");
      localStorage.removeItem("cart");
      navigate("/my-orders");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT SIDE */}
        <div style={styles.left}>
          <h2 style={styles.title}>Your Cart 🛒</h2>

          {cart.length === 0 ? (
            <div style={styles.empty}>
              <h3>No Items Found 😢</h3>
              <button onClick={() => navigate("/")}>
                Go Shopping
              </button>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={i} style={styles.itemCard}>
                
                <div>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.price}>₹{item.price}</p>
                </div>

                <div style={styles.qtyBox}>
                  <button onClick={() => decreaseQty(i)}>-</button>
                  <span>{item.qty || 1}</span>
                  <button onClick={() => increaseQty(i)}>+</button>
                </div>

                <button style={styles.remove} onClick={() => removeItem(i)}>
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.right}>
          <h2>Order Summary</h2>

          <div style={styles.summaryBox}>
            <p>Items: {cart.length}</p>
            <h3>Total: ₹{total}</h3>
          </div>

          <textarea
            placeholder="Enter delivery address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.input}
          />

          <button onClick={placeOrder} style={styles.button}>
            Place Order 🍔
          </button>
        </div>

      </div>
    </div>
  );
}

/* 🎨 MODERN UI STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    padding: "30px 10px",
    fontFamily: "Arial",
  },

  container: {
    maxWidth: "1000px",
    margin: "auto",
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  left: {
    flex: 2,
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },

  right: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    height: "fit-content",
  },

  title: {
    marginBottom: "15px",
  },

  itemCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "12px",
    background: "#fafafa",
    border: "1px solid #eee",
  },

  itemName: {
    margin: 0,
  },

  price: {
    margin: 0,
    color: "#555",
  },

  qtyBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  remove: {
    background: "transparent",
    border: "none",
    color: "red",
    fontSize: "18px",
    cursor: "pointer",
  },

  summaryBox: {
    margin: "15px 0",
    padding: "10px",
    background: "#f9f9f9",
    borderRadius: "10px",
  },

  input: {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    marginBottom: "10px",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #ff4d2d, #ff7a00)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    padding: "30px",
  },
};