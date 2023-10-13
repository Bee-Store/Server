const AdminController = require("./../controllers/Admin.controller");
const router = require("express").Router();

router.post("/register", AdminController.Register)
router.post("/login", AdminController.Login);

module.exports = router;
