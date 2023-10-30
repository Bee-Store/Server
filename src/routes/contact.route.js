const ContactController = require("../controllers/ContactController");

const router = require("express").Router();

router.post("/new", ContactController.AddContact);
router.get("/", ContactController.getAllMessages);
router.delete("/:id", ContactController.DeleteMessage);

module.exports = router;
