// const Cart = require('./../models/Cart.model');
// const Product = require('./../models/Product.model');

// class CartController {
//   constructor() {}

//   // Add a product to the cart
//   async addToCart(req, res) {
//     try {
//       const productId = req.body.productId;
//       const quantity = req.body.quantity;

//       // Check if the product exists
//       const product = await Product.findById(productId);
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }

//       // Get the cart from the session, or create a new one if it doesn't exist
//       let cart;
//       if (req.session.cartId) {
//         cart = await Cart.findById(req.session.cartId);
//       } else {
//         cart = new Cart();
//         await cart.save();
//         req.session.cartId = cart._id;
//       }

//       // Add the product to the cart or increase the quantity if it's already in the cart
//       const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);
//       if (itemIndex > -1) {
//         // Product exists in the cart, increase quantity
//         cart.products[itemIndex].quantity += quantity;
//       } else {
//         // Product not in cart, add new item
//         cart.products.push({ product: productId, quantity });
//       }

//       // Save the updated cart and store its ID in the session
//       await cart.save();

//       res.status(200).json(cart);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   }

//   // Remove a product from the cart
//   async removeFromCart(req, res) {
//     try {
//       const productId = req.body.productId;

//       // Check if the product exists
//       const product = await Product.findById(productId);
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }

//       // Get the cart from the session
//       let cart;
//       if (req.session.cartId) {
//         cart = await Cart.findById(req.session.cartId);
//       } else {
//         return res.status(404).json({ message: 'Cart not found' });
//       }

//       // Find and remove the product from the cart
//       const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);
      
//       if (itemIndex > -1) {
//         // Product exists in the cart, remove it
//         cart.products.splice(itemIndex, 1);
        
//         // Save the updated cart and store its ID in the session
//         await cart.save();
        
//         res.status(200).json(cart);
//     } else {
//        return res.status(404).json({ message: 'Product not found in cart' });
//     }
//   } catch (error) {
//      res.status(500).json({ message: 'Server error' });
//   }
// }

//   // Get the current user's cart   
//   async getCart(req, res) {
//     try {
      
//        let cart;
      
//        if (req.session.cartId) {
//          // Populate product details in addition to just storing product IDs
//          cart = await Cart.findById(req.session.cartId).populate('products.product');
        
//          res.status(200).json(cart);
//        } else {
//          return res.status(404).json({ message: 'Cart not found' });
//        }
       
//     } catch (error) {
//        res.status(500).json({ message: 'Server error' });
//     }
//   }
  
//   // Increase the quantity of a product in the cart
//   async increaseQuantity(req, res) {
//     try {
//       const productId = req.body.productId;

//       // Check if the product exists
//       const product = await Product.findById(productId);
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }

//       // Get the cart from the session
//       let cart;
//       if (req.session.cartId) {
//         cart = await Cart.findById(req.session.cartId);
//       } else {
//         return res.status(404).json({ message: 'Cart not found' });
//       }

//       // Find the product in the cart
//       const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);
//       if (itemIndex < 0) {
//         return res.status(404).json({ message: 'Product not found in cart' });
//       }

//       // Increase the quantity of the product
//       cart.products[itemIndex].quantity++;

//       // Save the updated cart and store its ID in the session
//       await cart.save();

//       res.status(200).json(cart);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   }

//   // Decrease the quantity of a product in the cart
//   async decreaseQuantity(req, res) {
//     try {
//       const productId = req.body.productId;

//       // Check if the product exists
//       const product = await Product.findById(productId);
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }

//       // Get the cart from the session
//       let cart;
//       if (req.session.cartId) {
//         cart = await Cart.findById(req.session.cartId);
//       } else {
//         return res.status(404).json({ message: 'Cart not found' });
//       }

//       // Find the product in the cart
//       const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);
//       if (itemIndex < 0) {
//         return res.status(404).json({ message: 'Product not found in cart' });
//       }

//       // Decrease the quantity of the product
//       cart.products[itemIndex].quantity--;

//       // If the quantity is zero, remove the product from the cart
//       if (cart.products[itemIndex].quantity === 0) {
//         cart.products.splice(itemIndex, 1);
//       }

//       // Save the updated cart and store its ID in the session
//       await cart.save();

//       res.status(200).json(cart);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   }
// }

// module.exports = new CartController();
const Cart = require('./../models/Cart.model');
const Product = require('./../models/Product.model');

class CartController {
  constructor() {}

  // Add a product to the cart
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

      // If the user is logged in, add the product to the cart in the backend
      if (req.user) {
        let cart;
        if (req.session.cartId) {
          cart = await Cart.findById(req.session.cartId);
        } else {
          cart = new Cart();
          await cart.save();
          req.session.cartId = cart._id;
        }

        const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (itemIndex > -1) {
          cart.products[itemIndex].quantity += quantity;
        } else {
          cart.products.push({ product: productId, quantity });
        }

        await cart.save();

        res.status(200).json(cart);
      } else {
        // If the user is not logged in, add the product to the temporary cart in local storage
        // Note: This should be handled on the client side, not on the server side
        res.status(200).json({ message: 'Product added to temporary cart' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Remove a product from the cart
  async removeFromCart(req, res) {
    try {
      const productId = req.body.productId;

      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Get the cart from the session
      let cart;
      if (req.session.cartId) {
        cart = await Cart.findById(req.session.cartId);
      } else {
        return res.status(404).json({ message: 'Cart not found' });
      }

      // Find and remove the product from the cart
      const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);
      
      if (itemIndex > -1) {
        // Product exists in the cart, remove it
        cart.products.splice(itemIndex, 1);
        
        // Save the updated cart and store its ID in the session
        await cart.save();
        
        res.status(200).json(cart);
    } else {
       return res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
     res.status(500).json({ message: 'Server error' });
  }
}

  // Get the current user's cart   
  async getCart(req, res) {
    try {
      
       let cart;
      
       if (req.session.cartId) {
         // Populate product details in addition to just storing product IDs
         cart = await Cart.findById(req.session.cartId).populate('products.product');
        
         res.status(200).json(cart);
       } else {
         return res.status(404).json({ message: 'Cart not found' });
       }
       
    } catch (error) {
       res.status(500).json({ message: 'Server error' });
    }
  }
  
  // Increase the quantity of a product in the cart
  async increaseQuantity(req, res) {
    try {
      const productId = req.body.productId;

      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Get the cart from the session
      let cart;
      if (req.session.cartId) {
        cart = await Cart.findById(req.session.cartId);
      } else {
        return res.status(404).json({ message: 'Cart not found' });
      }

      // Find the product in the cart
      const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);
      if (itemIndex < 0) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      // Increase the quantity of the product
      cart.products[itemIndex].quantity++;

      // Save the updated cart and store its ID in the session
      await cart.save();

      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Decrease the quantity of a product in the cart
  async decreaseQuantity(req, res) {
    try {
      const productId = req.body.productId;

      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Get the cart from the session
      let cart;
      if (req.session.cartId) {
        cart = await Cart.findById(req.session.cartId);
      } else {
        return res.status(404).json({ message: 'Cart not found' });
      }

      // Find the product in the cart
      const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);
      if (itemIndex < 0) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      // Decrease the quantity of the product
      cart.products[itemIndex].quantity--;

      // If the quantity is zero, remove the product from the cart
      if (cart.products[itemIndex].quantity === 0) {
        cart.products.splice(itemIndex, 1);
      }

      // Save the updated cart and store its ID in the session
      await cart.save();

      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new CartController();

