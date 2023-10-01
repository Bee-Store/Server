const User = require("./../models/User.model");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const Logger = require("../middlewares/loggers/logger");

class UserController {
  constructor() {}
  // Register
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
        password: CryptoJS.SHA256(
          req.body.password,
          process.env.PASS_SEC
        ).toString(),
        phoneNumber: req.body.phoneNumber,
      });

      await newUser.save();

      res
        .status(200)
        .json({ message: "Account created Successfully. Login to proceed." });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  }

  // Login
  async Login(req, res) {
    try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        res
          .status(404)
          .json({ message: "Either password or email is incorrect" });
      }
      const hashed = CryptoJS.SHA256(
        req.body.password,
        process.env.PASS_SEC
      ).toString();

      const ifPasswordMatch = user.password === hashed ? true : false;

      if (!ifPasswordMatch) {
        return {
          status: 400,
          message: "Login failed. Either password or email is incorrect",
        };
      }

      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SEC, {
        expiresIn: "12h",
      });

      const { password, ...others } = user.toObject();

      res.status(200).json({
        message: "Login successful",
        data: {
          user: others,
          access_token: accessToken,
        },
      });
    } catch (error) {
      Logger.debug(error);
      return {
        status: 500,
        message: "User Login Failed",
        error: {
          errors: {
            details: error,
          },
        },
      };
    }
  }

  // Get user profile
  async Profile(req, res) {
    try {
      const user = await req.user;
      console.log(user.id);
    } catch (error) {
      Logger.debug(error);
      return {
        status: 500,
        message: "User Login Failed",
        error: {
          errors: {
            details: error,
          },
        },
      };
    }
  }
}

module.exports = new UserController();
