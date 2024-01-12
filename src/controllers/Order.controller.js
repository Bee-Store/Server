const Order = require("./../models/Order.model");
const User = require("./../models/User.model");
const Logger = require("../middlewares/loggers/logger");
const mongoose = require("mongoose");

class OrderController {
  constructor() {}

  async GetAllOrders(req, res) {
    try {
      const allOrders = await Order.find({}).populate("customerId"); // Use lean() to return plain JavaScript objects
      if (!allOrders) {
        res.status(404).json({ data: "No order found" });
      }

      console.log(allOrders)
      res.status(200).json({ data: allOrders });
    } catch (error) {
      Logger.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async GetCustomerOrder(req, res) {
    try {
      const user = await req.user;
      const CustomerOrder = await Order.find({ customerId: user.id });
      if (!CustomerOrder) {
        res.status(404).json({ message: "You have no orders yet" });
      }
      res.json(CustomerOrder);
    } catch (error) {
      Logger.error(error);
    }
  }

  async OrderProduct(req, res) {
    try {
    } catch (error) {
      Logger.error(error);
    }
  }
}

module.exports = new OrderController();
