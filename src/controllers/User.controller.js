const User = require("./../models/User.model");
const jwt = require("jsonwebtoken");
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
        password: await helpers.generateSecurePassword(req.body.password),
      });

      const savedUser = await newUser.save()

      res.status(200).json({ message: savedUser });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  }
}

module.exports = new UserController();
