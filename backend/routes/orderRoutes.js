const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

const router = express.Router();

// Place Order
router.post("/place", auth, async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { items, totalAmount, address } = req.body;

    const order = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      address,
    });

    await order.save();

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// My Orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Get All Orders (Admin)
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Update Order Status
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ❌ Cancel Order
router.put("/cancel/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // only owner can cancel
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order Cancelled",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;