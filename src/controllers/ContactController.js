const Contact = require("./../models/Contact.model");
const dotenv = require("dotenv");
const Logger = require("../middlewares/loggers/logger");

dotenv.config();

class ContactController {
  constructor() {}

  async AddContact(req, res) {
    try {
      const newContact = new Contact({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        topic: req.body.topic,
      });

      await newContact.save();

      res.status(200).json({
        message: "Thanks for your your feedback. We will get in touch with you",
      });
    } catch (error) {
      Logger.error(error);
    }
  }

  async getAllMessages(req, res) {
    try {
      const allMessages = await Contact.find({});
      if (!allMessages) {
        res.status(200).json({ Message: "No messages found" });
      }
      res.status(200).json({ data: allMessages });
    } catch (error) {
      Logger.error(error);
    }
  }

  // Delete message by ID
  async DeleteMessage(req, res) {
    try {
      const message = await Contact.findByIdAndDelete(req.params.id)
      res.status(200).json({message: "Message deleted successfully"});
    } catch (error) {
      Logger.error(error);
    }
  }
}

module.exports = new ContactController();
