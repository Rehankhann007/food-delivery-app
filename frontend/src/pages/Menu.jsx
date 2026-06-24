import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const API_BASE = "https://food-delivery-app-e4by.onrender.com/api";

function FoodCard({ food, index, addToCart, observe }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    observe(node);

    return () => observe(node, true);
  }, [observe]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
      className="fade-up food-card group rounded-3xl overflow-hidden"
    >
      <div className="relative overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          decoding="async"
          className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {food.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-lg font-bold text-white">{food.name}</h3>
          <span className="text-orange-400 font-bold text-lg whitespace-nowrap">
            ₹{food.price}
          </span>
        </div>

        <p className="text-white/50 text-sm mt-2 line-clamp-2">
          {food.description}
        </p>

        <div className="flex items-center justify-between mt-5">
          <span className="text-xs text-white/40">🚚 Free delivery</span>

          <button
            onClick={() => addToCart(food)}
            className="btn-glow text-white px-5 py-2 rounded-xl font-medium text-sm"
          >
            Add +
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Menu({ cart, setCart }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [activeCategory]);

  // Sync search box if Navbar sends a ?search= query param
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/foods/categories`);
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/foods`, {
        params: activeCategory !== "All" ? { category: activeCategory } : {},
      });
      setFoods(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Shared IntersectionObserver for scroll-in animation
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    return () => observerRef.current?.disconnect();
  }, []);

  const observe = useCallback((el, shouldUnobserve = false) => {
    if (!el || !observerRef.current) return;

    if (shouldUnobserve) {
      observerRef.current.unobserve(el);
    } else {
      observerRef.current.observe(el);
    }
  }, []);

  const addToCart = useCallback(
    (food) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item._id === food._id);

        if (existingItem) {
          return prevCart.map((item) =>
            item._id === food._id ? { ...item, qty: (item.qty || 1) + 1 } : item
          );
        }

        return [...prevCart, { ...food, qty: 1 }];
      });
    },
    [setCart]
  );

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set("search", value);
    } else {
      next.delete("search");
    }
    setSearchParams(next, { replace: true });
  };

  const filteredFoods = useMemo(() => {
    if (!searchTerm.trim()) return foods;
    const q = searchTerm.toLowerCase();
    return foods.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q)
    );
  }, [foods, searchTerm]);

  const tabs = ["All", ...categories];

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 relative" style={{ background: "var(--bg-deep)" }}>
      <div className="glow-bg">
        <div className="glow-blob b1"></div>
        <div className="glow-blob b3"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 fade-up in-view">
          <span className="text-orange-400 text-sm font-semibold uppercase tracking-[0.2em]">
            Explore
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            All foods
          </h1>
          <p className="text-white/50 mt-3">
            Browse every category and find your next favourite
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-8 relative">
       
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search for dishes..."
            className="auth-input pl-11"
          />

          {searchTerm && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2.5 mb-10 overflow-x-auto pb-2 justify-center flex-wrap">
          {tabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "btn-glow text-white"
                  : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-center text-white/40 py-20">Loading foods...</p>
        ) : filteredFoods.length === 0 ? (
          <div className="glass-card max-w-md mx-auto p-10 text-center fade-up in-view">
            <h2 className="text-white text-lg font-semibold mb-2">
              No foods found 😢
            </h2>
            <p className="text-white/50 text-sm">
              Try a different search term or category
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 pb-10">
            {filteredFoods.map((food, index) => (
              <FoodCard
                key={food._id}
                food={food}
                index={index}
                addToCart={addToCart}
                observe={observe}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}