const Cart = require('./../models/Cart.model');
const Product = require('./../models/Product.model');

class CartController {
  constructor() {}

  // Add a product to the cart
  async addToCart(req, res) {
    try {
      const productId = req.body.productId;
      const quantity = req.body.quantity;

      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Get the cart from the session, or create a new one if it doesn't exist
      let cart;
      if (req.session.cartId) {
        cart = await Cart.findById(req.session.cartId);
      } else {
        cart = new Cart();
      }

      // Add the product to the cart or increase the quantity if it's already in the cart
      const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);
      if (itemIndex > -1) {
        // Product exists in the cart, increase quantity
        const itemInCart = cart.products[itemIndex];
        itemInCart.quantity += quantity;
        cart.products[itemIndex] = itemInCart;
      } else {
        // Product not in cart, add new item
        cart.products.push({ product: productId, quantity });
      }

      // Save the cart and store its ID in the session
      await cart.save();
      req.session.cartId = cart._id;

      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new CartController();
