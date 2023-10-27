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
      console.log(req.body.tempCart);
      const user = await User.findById(req.body.user.id);
      const token = await req.token;
      const totalPrice = req.body.tempCart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      console.log(totalPrice);
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
        .then((data) => {
          console.log(data);
          res.status(200).json(data.data);
        });

        const newOrder = new Order({
          // orderDetails:
          customerId: user._id,
          orderDate: timestamp,
          totalAmount: totalPrice,
          products: req.body.tempCart,
          status: "Pending",
        });

        await newOrder.save();





      // const passkey = process.env.MPESA_PASSKEY;

      // const password = new Buffer.from(
      //   shortcode + passkey + timestamp
      // ).toString("base64");

      // await axios
      //   .post(
      //     process.env.STK_URL,
      //     {
      //       BusinessShortCode: shortcode,
      //       Password: password,
      //       Timestamp: timestamp,
      //       TransactionType: "CustomerPayBillOnline",
      //       Amount: req.body.amount,
      //       PartyA: `254${req.body.phone}`,
      //       PartyB: shortcode,
      //       PhoneNumber: `254742453610`,
      //       CallBackURL: "https://mydomain.com/pat",
      //       AccountReference: `254${req.body.phone}`,
      //       TransactionDesc: "This is just a test transaction",
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   )
      //   .then((data) => {
      //     console.log(data.data);
      //     res.status(200).json(data.data);
      //   });
      // console.log(token);
    } catch (error) {
      console.log(error);
      Logger.debug(error);
      //   return {
      //     status: 500,
      //     message: "Stk push Failed",
      //     error: {
      //       errors: {
      //         details: error,
      //       },
      //     },
      //   };
    }
  }
}

module.exports = new MpesaController();
