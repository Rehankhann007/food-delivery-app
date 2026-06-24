const express = require("express");
const Food = require("../models/Food");
const auth = require("../middleware/auth");

const router = express.Router();

// Add Food (admin only)
router.post("/add", auth, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const food = new Food(req.body);

    await food.save();

    res.json({
      success: true,
      message: "Food Added Successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get All Foods (optionally filter by category / search)
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const foods = await Food.find(filter);

    res.json(foods);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Get distinct categories (for dropdowns / filter tabs)
router.get("/categories", async (req, res) => {
  try {
    const categories = await Food.distinct("category");
    res.json(categories.filter(Boolean).sort());
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Update Food (admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Food (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Food deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔥 BULK ADD FOODS (admin only)
router.post("/bulk-add", auth, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

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