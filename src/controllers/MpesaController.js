const dotenv = require("dotenv");
const Logger = require("../middlewares/loggers/logger");
const axios = require("axios");

dotenv.config();

class MpesaController {
  constructor() {}
  async stk(req, res) {
    try {
      const token = await req.token;
      const phone = req.body.phone;
      const amount = req.body.amount;

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
            Amount: amount,
            PartyA: `254${phone}`,
            PartyB: shortcode,
            PhoneNumber: `254${phone}`,
            CallBackURL: "https://mydomain.com/pat",
            AccountReference: `254${phone}`,
            TransactionDesc: "Test",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((data) => {
          console.log(data);
          res.status(200).json(data);
        });
      console.log(token);
    } catch (error) {
      console.log(error);
      //   Logger.debug(error);
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
