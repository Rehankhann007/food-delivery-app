const mongoose = require("mongoose");
const Food = require("./models/Food");

// 🔥 MongoDB connection (same as your project)
mongoose.connect("mongodb://localhost:27017/foodapp")
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const foods = [
  {
    name: "Burger",
    description: "Cheese Burger",
    price: 120,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    category: "Fast Food"
  },
  {
    name: "Pizza",
    description: "Cheese Pizza",
    price: 250,
    image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d1",
    category: "Fast Food"
  },
  {
    name: "Pasta",
    description: "White Sauce Pasta",
    price: 180,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    category: "Italian"
  }
];

const seedData = async () => {
  try {
    await Food.deleteMany();
    await Food.insertMany(foods);

    console.log("🔥 Data Inserted Successfully");

    process.exit();
  } catch (err) {
    console.log(err);
  }
};

seedData();