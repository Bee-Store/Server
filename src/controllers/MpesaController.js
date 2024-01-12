const dotenv = require("dotenv");
const Logger = require("../middlewares/loggers/logger");
const axios = require("axios");
const User = require("./../models/User.model");
const Order = require("./../models/Order.model");

dotenv.config();

class MpesaController {
  constructor() {}
  async stk(req, res) {
    try {
      const user = await User.findById(req.body.user.id);
      const token = await req.token;
      const totalPrice = req.body.tempCart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      // generating timestamp
      const date = new Date();
      const timestamp =
        date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);

      const shortcode = process.env.MPESA_SHORTCODE;
      const passkey = process.env.MPESA_PASSKEY;

      const password = new Buffer.from(
        shortcode + passkey + timestamp
      ).toString("base64");

      await axios
        .post(
          process.env.STK_URL,
          {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: totalPrice,
            PartyA: `254${user.phoneNumber}`,
            PartyB: shortcode,
            PhoneNumber: `254742453610`,
            CallBackURL: "https://mydomain.com/pat",
            AccountReference: `254${user.phoneNumber}`,
            TransactionDesc: "This is just a test transaction",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(async (data) => {
          if (
            data.data.ResponseDescription ===
            "Success. Request accepted for processing"
          ) {
            // res.status(200).json(data.data);
            const newOrder = new Order({
              // orderDetails:
              customerId: user._id,
              orderDate: timestamp,
              totalAmount: totalPrice,
              products: req.body.tempCart,
              status: "Pending",
            });

            await newOrder.save();
            res.status(201).json({Message: "Order saved successfully"})
          }
        });
    } catch (error) {
      error;
      Logger.debug(error);
    }
  }
}

module.exports = new MpesaController();
