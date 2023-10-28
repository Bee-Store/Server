const OrderController = require("../controllers/Order.controller");

const router = require("express").Router();

router.get("/all", OrderController.GetAllOrders);

module.exports = router;
