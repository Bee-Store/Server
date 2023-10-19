const Admin = require("../models/Admin.model");
const jwt = require("jsonwebtoken");
const transporter = require("../helpers/helpers");
const path = require("path");
const CryptoJS = require("crypto-js");
const Logger = require("../middlewares/loggers/logger");
const generateRandomString = require("../helpers/GenerateRandom");
const dotenv = require("dotenv");
const pdfTemplate = require("./../documents");
const pdf = require("html-pdf");

const fs = require("fs");

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

      res.status(200).json({ user: newUser });
    } catch (error) {
      Logger.error(error);
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  }

  async Login(req, res) {
    try {
      const user = await Admin.findOne({ email: req.body.email });

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
      Logger.error(error);
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  }

  async TestPdf(req, res) {
    try {
      const invoiceFolder = path.join(__dirname, "../invoice");
      pdf
        .create(pdfTemplate(req.body), {})
        .toFile(
          path.join(invoiceFolder, `invoice-${req.body.name}.pdf`),
          (err) => {
            if (err) {
              res.send(Promise.reject());
            }

            res.send(Promise.resolve());
          }
        );

      // getting th created invoice/receipt pdf
      const invoiceFile = path.join(
        __dirname,
        `../invoice/invoice-${req.body.name}.pdf`
      );
      // Sending the invoice/receipt to the user who has completed the purchase process/
      const info = transporter.sendMail({
        from: process.env.GMAIL_USERNAME,
        to: req.body.email,
        subject: "This is your invoice",
        text: `Hello ${req.body.name}`,
        attachments: [
          {
            filename: `invoice-${req.body.name}.pdf`,
            path: invoiceFile,
          },
        ],
      });

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new AdminController();
