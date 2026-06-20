import { useEffect, useState } from "react";
import axios from "axios";

function Home({ cart, setCart }) {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    getFoods();
  }, []);

  const getFoods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/foods");
      setFoods(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = (food) => {
    const existingItem = cart.find(
      (item) => item._id === food._id
    );

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item._id === food._id
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      );

      setCart(updatedCart);
    } else {
      setCart([...cart, { ...food, qty: 1 }]);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">

      {/* HERO SECTION */}
      <div className="bg-orange-500 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Order Delicious Food Online 🍔
        </h1>
        <p className="text-xl">
          Fresh Food Delivered To Your Doorstep
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-3xl font-bold mb-6">
          Popular Foods 🍕
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-bold">
                  {food.name}
                </h3>

                <p className="text-gray-600 mt-2">
                  {food.description}
                </p>

                <h4 className="text-green-600 text-xl font-bold mt-3">
                  ₹{food.price}
                </h4>

                <button
                  onClick={() => addToCart(food)}
                  className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 active:scale-95 transition cursor-pointer"
                >
                  Add To Cart
                </button>
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
            <p className="text-gray-400 hover:text-white cursor-pointer">
              Home
            </p>
            <p className="text-gray-400 hover:text-white cursor-pointer">
              Menu
            </p>
            <p className="text-gray-400 hover:text-white cursor-pointer">
              Orders
            </p>
            <p className="text-gray-400 hover:text-white cursor-pointer">
              Profile
            </p>
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