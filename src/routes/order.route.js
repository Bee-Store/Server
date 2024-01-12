const OrderController = require("../controllers/Order.controller");
const authenticateRequest = require("../validators/auth.validators");

const router = require("express").Router();

router.get("/all", OrderController.GetAllOrders);
// Getting order for a specific customer
router.get(
  "/customer",
  authenticateRequest(),
  OrderController.GetCustomerOrder
);

router.post("/add", OrderController.OrderProduct)

module.exports = router;
