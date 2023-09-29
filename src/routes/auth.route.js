const UserController = require("./../controllers/User.controller");
const router = require("express").Router();

router.post("/register", UserController.Register);

module.exports = router;
