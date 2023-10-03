const dotenv = require("dotenv");
const Logger = require("../middlewares/loggers/logger");

dotenv.config();

class ContactController {
  constructor() {}

  async AddContact(req, res) {
    console.log("This route is working")
    try {
    } catch (error) {
      Logger.error(error);
    }
  }
}

module.exports = new ContactController();
