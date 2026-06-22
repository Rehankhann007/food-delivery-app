import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-creative";

function Home({ cart, setCart }) {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    getFoods();
  }, []);

  const getFoods = async () => {
    try {
      const res = await axios.get("https://food-delivery-app-e4by.onrender.com/api/foods");
      setFoods(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = (food) => {
  console.log("CLICKED", food.name);

  setCart((prevCart) => {
    console.log("PREV CART", prevCart);

    const existingItem = prevCart.find(
      (item) => item._id === food._id
    );

    if (existingItem) {
      return prevCart.map((item) =>
        item._id === food._id
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      );
    }

    return [...prevCart, { ...food, qty: 1 }];
  });
};

const heroImages = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9",
];

const [currentSlide, setCurrentSlide] = useState(0);
const [prevSlide, setPrevSlide] = useState(null);

useEffect(() => {
  const interval = setInterval(() => {
    setPrevSlide(currentSlide);

    setCurrentSlide((prev) =>
      (prev + 1) % heroImages.length
    );
  }, 4000);

  return () => clearInterval(interval);
}, [currentSlide]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">

      {/* HERO SECTION */}
    <div id="hero" className="hero-container">

  {heroImages.map((img, index) => {
    let className = "hero-slide";

    if (index === currentSlide) {
      className += " active";
    }

    if (index === prevSlide) {
      className += " exit";
    }

    return (
      <img
        key={index}
        src={img}
        alt=""
        className={className}
      />
    );
  })}

  <div className="hero-overlay"></div>

  <div className="hero-content">
    <h1 className="text-6xl font-bold">
      Delicious Food Delivered Fast
    </h1>

    <p className="mt-4 text-xl">
      Fresh Food At Your Doorstep
    </p>

    <a href="#menu">
      <button className="mt-6 bg-orange-500 px-6 py-3 rounded-xl">
        Order Now
      </button>
    </a>
  </div>

</div>

      {/* MAIN CONTENT */}
      <div id="menu" className="flex-1 max-w-7xl mx-auto px-6 py-10">

        <div className="mb-10 text-center">
  <h2 className="text-4xl font-extrabold text-gray-800">
    Popular Foods
  </h2>

  <p className="text-gray-500 mt-2">
    Freshly prepared & delivered to your doorstep
  </p>
</div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {foods.map((food) => (
            <div
  key={food._id}
  className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
>
  <div className="relative overflow-hidden">

    <img
      src={food.image}
      alt={food.name}
      className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
    />

    <div className="absolute top-3 left-3">
      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
        Popular
      </span>
    </div>

    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg shadow">
      ⭐ 4.8
    </div>

  </div>

  <div className="p-5">

    <div className="flex justify-between items-start">
      <h3 className="text-xl font-bold text-gray-800">
        {food.name}
      </h3>

      <span className="text-green-600 font-bold text-xl">
        ₹{food.price}
      </span>
    </div>

    <p className="text-gray-500 mt-2 line-clamp-2">
      {food.description}
    </p>

    <div className="flex items-center justify-between mt-5">

      <span className="text-sm text-gray-400">
        🚚 Free Delivery
      </span>

      <button
        onClick={() => addToCart(food)}
        className="bg-linear-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-xl font-medium hover:scale-105 transition"
      >
        Add +
      </button>

    </div>

  </div>
</div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white mt-10">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">

          <div>
            <h2 className="text-2xl font-bold text-orange-400">
              BiteMeNow 🍔
            </h2>
            <p className="text-gray-400 mt-3">
              Delicious food delivered fast at your doorstep.
              Built with MERN stack.
            </p>
          </div>

          <div>
  <h3 className="text-lg font-semibold mb-3">
    Quick Links
  </h3>

  <a
    href="#hero"
    className="block text-gray-400 hover:text-orange-400 mb-2"
  >
    Home
  </a>

  <a
  href="#menu"
  className="block text-gray-400 hover:text-orange-400 mb-2"
>
  Menu
</a>

  <Link
    to="/orders"
    className="block text-gray-400 hover:text-orange-400 mb-2"
  >
    Orders
  </Link>

  <Link
    to="/profile"
    className="block text-gray-400 hover:text-orange-400"
  >
    Profile
  </Link>
</div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Categories
            </h3>
            <p className="text-gray-400">Burger</p>
            <p className="text-gray-400">Pizza</p>
            <p className="text-gray-400">Pasta</p>
            <p className="text-gray-400">Drinks</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Contact
            </h3>
            <p className="text-gray-400">
              support@bitemenow.com
            </p>
            <p className="text-gray-400">
              +91 98765 43210
            </p>
            <p className="text-gray-400">
              India
            </p>
          </div>

        </div>

        <div className="border-t border-gray-700 text-center py-4 text-gray-500">
          © {new Date().getFullYear()} BiteMeNow. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

export default Home;