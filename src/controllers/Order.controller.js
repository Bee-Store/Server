const Order = require("./../models/Order.model");
const User = require("./../models/User.model");
const Logger = require("../middlewares/loggers/logger");
const mongoose = require("mongoose");

class OrderController {
  constructor() {}

  async GetAllOrders(req, res) {
    try {
      const allOrders = await Order.find({}).lean(); // Use lean() to return plain JavaScript objects
      if (!allOrders) {
        res.status(404).json({ data: "No order found" });
      }
      const ordersWithUsers = [];

      for (const order of allOrders) {
        const { customerId, ...orderData } = order;

        try {
          const user = await User.findOne({
            _id: customerId,
          }).lean(); // Use lean() to return plain JavaScript objects

          if (user) {
            // Combine user and order data
            const orderWithUser = {
              user,
              ...orderData,
            };
            ordersWithUsers.push(orderWithUser);
            res.status(200).json({ data: ordersWithUsers });
          } else {
            res.status(404).json({ data: "No order found" });
          }
        } catch (error) {
          console.error(`Error retrieving user: ${error}`);
        }
      }
    } catch (error) {
      Logger.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async GetCustomerOrder(req, res) {
    try {
      const user = await req.user;
      const CustomerOrder = await Order.findOne({ customerId: user.id });
      if (!CustomerOrder) {
        res.status(404).json({ message: "You have no orders yet" });
      }
      res.json(CustomerOrder.products);
    } catch (error) {
      Logger.error(error);
    }
  }
}

module.exports = new OrderController();
