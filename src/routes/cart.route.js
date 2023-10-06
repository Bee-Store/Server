// const express = require('express');
// const router = express.Router();
// const cartController = require('./../controllers/CartController');

// router.post('/add', cartController.addToCart);
// router.post('/remove', cartController.removeFromCart); 
// router.get('/', cartController.getCart);

// module.exports = router;
const express = require('express');
const router = express.Router();
const cartController = require('./../controllers/CartController');

router.post('/add', cartController.addToCart);
router.post('/remove', cartController.removeFromCart); 
router.post('/increase', cartController.increaseQuantity); // new route for increasing quantity
router.post('/decrease', cartController.decreaseQuantity); // new route for decreasing quantity
router.get('/', cartController.getCart);

module.exports = router;
