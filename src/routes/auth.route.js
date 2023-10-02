const UserController = require("./../controllers/User.controller");
const ProductController = require("./../controllers/ProductController")
const router = require("express").Router();
const authenticateRequest = require("./../validators/auth.validators");

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.get("/user", authenticateRequest(), UserController.Profile);
// Get all products
// router.get('/products', ProductController.getProducts);
// // Create a new product
// router.post('/products', ProductController.createProduct);
// // Update a product
// router.put('/products/:id', ProductController.updateProduct);
// // Delete a product
// router.delete('/products/:id', ProductController.deleteProduct);

module.exports = router;
