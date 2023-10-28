const express = require("express");
const router = express.Router();
const generateToken = require("../middlewares/mpesa/GenerateToken");
const MpesaController = require("../controllers/MpesaController");

// Add a product to the cart
router.post("/stk", generateToken, MpesaController.stk);
router.get("/token", (req, res) => generateToken());

module.exports = router;
