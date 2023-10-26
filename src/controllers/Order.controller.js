const Order = require("./../models/Order.model");
const Logger = require("../middlewares/loggers/logger");

class OrderController {
  constructor() {}

  async GetAllOrders(req, res) {
    try {
      const allOrders = await Order.find({});
      if (allOrders) {
        res.json({ data: allOrders }).status(200);
      }
    } catch (error) {
      Logger.error(error);
    }
  }
}

module.exports = new OrderController();
