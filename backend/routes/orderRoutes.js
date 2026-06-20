const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

const router = express.Router();

//
// PLACE ORDER
//
router.post("/place", auth, async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    const order = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      address,
      status: "Pending",
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

//
// MY ORDERS
//
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//
// ADMIN - ALL ORDERS
//
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//
// UPDATE ORDER STATUS
//
router.put("/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    console.log("ORDER ID:", req.params.id);
    console.log("NEW STATUS:", status);

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    console.log("UPDATED:", order.status);

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

//
// CANCEL ORDER
//
router.put("/cancel/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    order.status = "Cancelled";

    await order.save();

    res.json({
      success: true,
      message: "Order Cancelled",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;