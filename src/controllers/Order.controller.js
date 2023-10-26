const Order = require("./../models/Order.model");
const User = require("./../models/User.model");
const Logger = require("../middlewares/loggers/logger");

class OrderController {
  constructor() {}

  async GetAllOrders(req, res) {
    try {
      const allOrders = await Order.find({}).lean(); // Use lean() to return plain JavaScript objects
      if (allOrders) {
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
            } else {
              console.log(
                `User not found for order with customerId: ${customerId}`
              );
            }
          } catch (error) {
            console.error(`Error retrieving user: ${error}`);
          }
        }

        res.status(200).json({ data: ordersWithUsers });
      }
    } catch (error) {
      Logger.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new OrderController();
