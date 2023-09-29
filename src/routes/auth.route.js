const UserController = require("./../controllers/User.controller");
const router = require("express").Router();

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);

module.exports = router;
