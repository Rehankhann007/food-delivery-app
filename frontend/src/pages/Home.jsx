import { useEffect, useState, useRef, useCallback, memo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/*
  PERF FIXES (why the old Home page felt laggy):
  1. Hero images were full-resolution Unsplash photos (several MB each).
     -> Now requesting a sized + compressed version via Unsplash's own
        resize params (?w=1600&q=70&auto=format), so the browser downloads
        a fraction of the bytes.
  2. The slider interval re-rendered the WHOLE Home component every 4s
     (because currentSlide/prevSlide lived in the same component as the
     food grid). That forced React to re-diff the food cards too.
     -> Hero slider is split into its own memoized component so its
        interval only re-renders itself, not the food list below.
  3. translateY(-100%) / translateY(100%) animations are layout-cheap but
     still trigger paint on large elements without a GPU layer.
     -> CSS now uses opacity-only crossfade with `transform: translate3d`
        + `will-change`, which the browser can composite on the GPU
        instead of repainting the whole hero on every tick.
  4. Cards used `whileInView`-less plain divs with no stagger; scroll-in
     animation is now done with one shared IntersectionObserver instead of
     one per card (cheaper than per-card observers/listeners).
*/

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&q=70&auto=format&fit=crop",
];

const Hero = memo(function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="hero" className="hero-container">
      {HERO_IMAGES.map((img, index) => (
        <img
          key={img}
          src={img}
          alt=""
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          className={`hero-slide ${index === currentSlide ? "active" : ""}`}
        />
      ))}

      <div className="hero-overlay"></div>

      <div className="hero-content px-6">
        <span className="uppercase tracking-[0.3em] text-xs sm:text-sm text-orange-400/90 font-semibold mb-4 fade-up in-view">
          Fast • Fresh • Delivered
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-white via-orange-100 to-orange-300 bg-clip-text text-transparent fade-up in-view">
          Delicious Food
          <br />
          Delivered Fast
        </h1>

        <p className="mt-5 text-base sm:text-xl text-white/70 max-w-md fade-up in-view">
          Fresh food at your doorstep, in minutes.
        </p>

        <a href="menu">
          <button className="btn-glow mt-8 text-white font-semibold px-8 py-3.5 rounded-2xl text-base sm:text-lg fade-up in-view">
            Order Now
          </button>
        </a>
      </div>
    </div>
  );
});

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
          <span className="badge-pulse bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Popular
          </span>
        </div>

        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-lg text-sm">
          ⭐ 4.8
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

function Home({ cart, setCart }) {
  const [foods, setFoods] = useState([]);
  const observerRef = useRef(null);

  useEffect(() => {
    getFoods();
  }, []);

  const getFoods = async () => {
    try {
      const res = await axios.get(
        "https://food-delivery-app-e4by.onrender.com/api/foods"
      );
      setFoods(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Single shared IntersectionObserver for all cards (cheaper than one per card)
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

  const addToCart = useCallback((food) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === food._id);

      if (existingItem) {
        return prevCart.map((item) =>
          item._id === food._id ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      }

      return [...prevCart, { ...food, qty: 1 }];
    });
  }, [setCart]);

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "var(--bg-deep)" }}>
      <div className="glow-bg">
        <div className="glow-blob b1"></div>
        <div className="glow-blob b3"></div>
      </div>

      <Hero />

      {/* MAIN CONTENT */}
      <div id="menu" className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full relative z-10">
        <div className="mb-12 text-center fade-up" ref={observe}>
          <span className="text-orange-400 text-sm font-semibold uppercase tracking-[0.2em]">
            Our Menu
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Popular Foods
          </h2>
          <p className="text-white/50 mt-3">
            Freshly prepared & delivered to your doorstep
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {foods.map((food, index) => (
            <FoodCard
              key={food._id}
              food={food}
              index={index}
              addToCart={addToCart}
              observe={observe}
            />
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 mt-10 relative z-10" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              BiteMeNow 🍔
            </h2>
            <p className="text-white/40 mt-3 text-sm leading-relaxed">
              Delicious food delivered fast at your doorstep. Built with the
              MERN stack.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-4 text-white">
              Quick links
            </h3>
            <a href="#hero" className="block text-white/50 hover:text-orange-400 transition mb-2.5 text-sm">
              Home
            </a>
            <a href="#menu" className="block text-white/50 hover:text-orange-400 transition mb-2.5 text-sm">
              Menu
            </a>
            <Link to="/orders" className="block text-white/50 hover:text-orange-400 transition mb-2.5 text-sm">
              Orders
            </Link>
            <Link to="/profile" className="block text-white/50 hover:text-orange-400 transition text-sm">
              Profile
            </Link>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-4 text-white">
              Categories
            </h3>
            {["Burger", "Pizza", "Pasta", "Drinks"].map((c) => (
              <p key={c} className="text-white/50 text-sm mb-2.5">
                {c}
              </p>
            ))}
          </div>

          <div>
            <h3 className="text-base font-semibold mb-4 text-white">
              Contact
            </h3>
            <p className="text-white/50 text-sm mb-2.5">support@bitemenow.com</p>
            <p className="text-white/50 text-sm mb-2.5">+91 98765 43210</p>
            <p className="text-white/50 text-sm">India</p>
          </div>
        </div>

        <div className="border-t border-white/5 text-center py-5 text-white/30 text-sm">
          © {new Date().getFullYear()} BiteMeNow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;