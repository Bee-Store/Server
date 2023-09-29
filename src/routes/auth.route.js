const UserController = require("./../controllers/User.controller");
const router = require("express").Router();

router.get("/", UserController.getStatus);

module.exports = router;
