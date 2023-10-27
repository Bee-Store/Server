const mongoose = require("mongoose");
const User = require("./User.model");
const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    products: { type: Array, default: [] },
    orderDetails: {
      type: String,
      required: false,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Order", orderSchema);
