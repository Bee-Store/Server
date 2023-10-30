const UserController = require("./../controllers/User.controller");
const router = require("express").Router();
const authenticateRequest = require("./../validators/auth.validators");

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.get("/user", authenticateRequest(), UserController.Profile);
router.post("/forgot/password", UserController.ForgotPassword);
router.post("/forgot/password/reset", UserController.ForgotPasswordReset);

// Getting all user
router.get("/", UserController.getAllUsers);


module.exports = router;
