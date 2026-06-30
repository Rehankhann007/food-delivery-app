import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../components/ToastContext";

const API_BASE = "https://food-delivery-app-e4by.onrender.com/api";

export default function Admin() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [activeTab, setActiveTab] = useState("orders");

  // ---- Food add state ----
  const [categories, setCategories] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodImage, setFoodImage] = useState("");
  const [foodCategory, setFoodCategory] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingFood, setAddingFood] = useState(false);
  const [foodError, setFoodError] = useState("");
  const [foods, setFoods] = useState([]);

  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchOrders();
    fetchCategories();
    fetchFoods();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/foods/categories`);
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await axios.get(`${API_BASE}/foods`);
      setFoods(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE}/orders/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Order status updated", "success");
      fetchOrders();
    } catch (err) {
      console.log(err);
      showToast("Failed to update status", "error");
    }
  };

  const resetFoodForm = () => {
    setFoodName("");
    setFoodDescription("");
    setFoodPrice("");
    setFoodImage("");
    setFoodCategory("");
    setIsNewCategory(false);
    setNewCategoryName("");
  };

  const handleAddFood = async () => {
    setFoodError("");
    const finalCategory = isNewCategory ? newCategoryName.trim() : foodCategory;

    if (!foodName.trim()) return setFoodError("Enter food name");
    if (!foodDescription.trim()) return setFoodError("Enter description");
    if (!foodPrice || Number(foodPrice) <= 0)
      return setFoodError("Enter a valid price");
    if (!foodImage.trim()) return setFoodError("Enter image URL");
    if (!finalCategory) return setFoodError("Select or enter a category");

    setAddingFood(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE}/foods/add`,
        {
          name: foodName.trim(),
          description: foodDescription.trim(),
          price: Number(foodPrice),
          image: foodImage.trim(),
          category: finalCategory,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Food added successfully 🍔", "success");
      resetFoodForm();
      fetchCategories();
      fetchFoods();
    } catch (err) {
      console.log(err);
      setFoodError(err?.response?.data?.message || "Failed to add food");
    } finally {
      setAddingFood(false);
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm("Delete this food item?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_BASE}/foods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("Food item deleted", "success");
      fetchFoods();
      fetchCategories();
    } catch (err) {
      console.log(err);
      showToast("Failed to delete food", "error");
    }
  };

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (acc, order) => acc + Number(order.totalAmount || 0),
    0
  );

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const statusStyles = {
    Pending: "text-amber-300",
    Preparing: "text-blue-300",
    "Out For Delivery": "text-orange-300",
    Delivered: "text-emerald-300",
    Cancelled: "text-red-300",
  };

  const stats = [
    { label: "Total orders", value: totalOrders, icon: "📦" },
    { label: "Revenue", value: `₹${totalRevenue}`, icon: "💰" },
    { label: "Pending", value: pendingOrders, icon: "🟡" },
    { label: "Delivered", value: deliveredOrders, icon: "🟢" },
  ];

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white placeholder-white/30 p-3 rounded-xl mb-4 outline-none focus:border-orange-400/50 focus:shadow-[0_0_0_3px_rgba(255,94,58,0.15)] transition-all";

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10" style={{ background: "var(--bg-deep)" }}>
      <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
        👨‍💼 Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto flex gap-2 mb-8 justify-center">
        {[
          { id: "orders", label: "📋 Orders" },
          { id: "foods", label: "🍔 Manage foods" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "btn-glow text-white"
                : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "orders" && (
        <>
          {/* Stats Cards */}
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="glass-card fade-up in-view p-5 text-center">
                <p className="text-white/50 text-sm mb-1">
                  {s.icon} {s.label}
                </p>
                <h2 className="text-3xl font-bold text-white">{s.value}</h2>
              </div>
            ))}
          </div>

          {/* Orders */}
          <h2 className="max-w-6xl mx-auto text-xl font-bold text-white mb-5">
            All orders
          </h2>

          <div className="max-w-6xl mx-auto space-y-5">
            {orders.map((order) => (
              <div key={order._id} className="glass-card fade-up in-view p-6">
                <div className="flex justify-between flex-wrap gap-5">
                  <div className="space-y-1 text-sm text-white/60">
                    <h3 className="text-white font-bold text-lg mb-2">
                      Order #{order._id.slice(-6)}
                    </h3>

                    <p>
                      <span className="text-white/40">User ID:</span>{" "}
                      {order.userId}
                    </p>
                    <p>
                      <span className="text-white/40">Name:</span>{" "}
                      {order.customerName}
                    </p>
                    <p>
                      <span className="text-white/40">Mobile:</span>{" "}
                      {order.mobileNumber}
                    </p>
                    <p>
                      <span className="text-white/40">Address:</span>{" "}
                      {order.address}
                    </p>
                    <p>
                      <span className="text-white/40">Total:</span> ₹
                      {order.totalAmount}
                    </p>
                    <p>
                      <span className="text-white/40">Status:</span>{" "}
                      <span
                        className={`font-semibold ${
                          statusStyles[order.status] || "text-white"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <select
                      value={selectedStatus[order._id] || order.status}
                      onChange={(e) =>
                        setSelectedStatus({
                          ...selectedStatus,
                          [order._id]: e.target.value,
                        })
                      }
                      className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-orange-400/50"
                    >
                      <option className="bg-[#13131c]" value="Pending">Pending</option>
                      <option className="bg-[#13131c]" value="Preparing">Preparing</option>
                      <option className="bg-[#13131c]" value="Out For Delivery">Out For Delivery</option>
                      <option className="bg-[#13131c]" value="Delivered">Delivered</option>
                      <option className="bg-[#13131c]" value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() =>
                        updateStatus(
                          order._id,
                          selectedStatus[order._id] || order.status
                        )
                      }
                      className="btn-glow text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Update
                    </button>
                  </div>
                </div>

                <hr className="my-5 border-white/10" />

                <h4 className="text-white/80 font-semibold mb-2">
                  🍔 Ordered items
                </h4>

                <div className="space-y-1.5">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-white/60"
                    >
                      <span>{item.name}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "foods" && (
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Add food form */}
          <div className="glass-card fade-up in-view p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-5">
              Add a new food item
            </h2>

            <label className="text-xs font-medium text-white/40 mb-1.5 block">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Cheese Burger"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className={inputClass}
            />

            <label className="text-xs font-medium text-white/40 mb-1.5 block">
              Description
            </label>
            <textarea
              placeholder="Short description shown on the card"
              value={foodDescription}
              onChange={(e) => setFoodDescription(e.target.value)}
              className={`${inputClass} h-20 resize-none`}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-white/40 mb-1.5 block">
                  Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="249"
                  value={foodPrice}
                  onChange={(e) => setFoodPrice(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-white/40 mb-1.5 block">
                  Category
                </label>
                {!isNewCategory ? (
                  <select
                    value={foodCategory}
                    onChange={(e) => {
                      if (e.target.value === "__new__") {
                        setIsNewCategory(true);
                        setFoodCategory("");
                      } else {
                        setFoodCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl mb-4 outline-none focus:border-orange-400/50"
                  >
                    <option className="bg-[#13131c]" value="">
                      Select category
                    </option>
                    {categories.map((c) => (
                      <option key={c} className="bg-[#13131c]" value={c}>
                        {c}
                      </option>
                    ))}
                    <option className="bg-[#13131c]" value="__new__">
                      + Add new category
                    </option>
                  </select>
                ) : (
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="New category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full bg-white/5 border border-orange-400/40 text-white placeholder-white/30 p-3 pr-9 rounded-xl outline-none focus:shadow-[0_0_0_3px_rgba(255,94,58,0.15)]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewCategory(false);
                        setNewCategoryName("");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      aria-label="Cancel new category"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            <label className="text-xs font-medium text-white/40 mb-1.5 block">
              Image URL
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={foodImage}
              onChange={(e) => setFoodImage(e.target.value)}
              className={inputClass}
            />

            {foodImage && (
              <img
                src={foodImage}
                alt="Preview"
                className="w-full h-36 object-cover rounded-xl mb-4 border border-white/10"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}

            {foodError && <p className="field-error">⚠️ {foodError}</p>}

            <button
              onClick={handleAddFood}
              disabled={addingFood}
              className="btn-glow w-full text-white py-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {addingFood ? "Adding..." : "Add food item"}
            </button>
          </div>

          {/* Existing foods list */}
          <div className="glass-card fade-up in-view p-6">
            <h2 className="text-xl font-bold text-white mb-5">
              All food items ({foods.length})
            </h2>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {foods.length === 0 && (
                <p className="text-white/40 text-sm">No food items yet.</p>
              )}

              {foods.map((food) => (
                <div
                  key={food._id}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3"
                >
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {food.name}
                    </p>
                    <p className="text-white/40 text-xs">
                      {food.category} • ₹{food.price}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteFood(food._id)}
                    className="text-red-400 hover:text-red-300 text-sm px-2"
                    aria-label="Delete food"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}