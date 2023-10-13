const AdminController = require("./../controllers/Admin.controller");
const router = require("express").Router();

router.post("/register", AdminController.Register)

module.exports = router;
