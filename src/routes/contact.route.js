const ContactController = require("../controllers/ContactController");

const router = require("express").Router();

router.post("/new", ContactController.AddContact);

module.exports = router;