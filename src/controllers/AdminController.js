const Admin = require("./../models/Admin.model");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const path = require("path");
const Logger = require("../middlewares/loggers/logger");
const generateRandomString = require("./../helpers/GenerateRandom");
const dotenv = require("dotenv");

dotenv.config();

class AdminController {
  constructor() {}
}

module.exports = new AdminController();
