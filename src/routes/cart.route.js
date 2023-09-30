const express = require('express');
const router = express.Router();
const CartController = require('./../controllers/CartController');

// Add a product to the cart
router.post('/cart', CartController.addToCart);

module.exports = router;
