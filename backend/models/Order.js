const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);