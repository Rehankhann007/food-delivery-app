const express = require("express");
const Food = require("../models/Food");

const router = express.Router();

// Add Food
router.post("/add", async (req, res) => {

  try {

    const food = new Food(req.body);

    await food.save();

    res.json({
      message: "Food Added Successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// Get All Foods
router.get("/", async (req, res) => {

  try {

    const foods = await Food.find();

    res.json(foods);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// 🔥 BULK ADD FOODS
router.post("/bulk-add", async (req, res) => {
  try {
    const foods = req.body; // array expect करेगा

    const result = await Food.insertMany(foods);

    res.json({
      success: true,
      count: result.length,
      foods: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;