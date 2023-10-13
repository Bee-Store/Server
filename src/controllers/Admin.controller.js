const Admin = require("../models/Admin.model");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const path = require("path");
const CryptoJS = require("crypto-js");
const Logger = require("../middlewares/loggers/logger");
const generateRandomString = require("../helpers/GenerateRandom");
const dotenv = require("dotenv");

dotenv.config();

class AdminController {
  constructor() {}

  async Register(req, res) {
    try {
      if (req.body.password !== req.body.password_confirmation) {
        res.status(500).json({
          message: "Password or email is incorrect",
        });
      }

      const newUser = new Admin({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.SHA256(
          req.body.password,
          process.env.PASS_SEC
        ).toString(),
      });

      await newUser.save();

      res
        .status(200)
        .json({user: newUser})
    } catch (error) {
      Logger.error(error)
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  }
}

module.exports = new AdminController();
