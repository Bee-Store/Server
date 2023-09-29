const User = require("./../models/User.model");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const helpers = require("./../helpers/helpers");

class UserController {
  constructor() {}

  async Register(req, res) {
    try {
      if (req.body.password !== req.body.password_confirmation) {
        res.status(500).json({
          message: "Password or email is incorrect",
        });
      }

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.PASS_SEC
        ).toString(),
        phoneNumber: req.body.phoneNumber,
      });

      const savedUser = await newUser.save();

      res.status(200).json({ message: newUser });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  }
}

module.exports = new UserController();
