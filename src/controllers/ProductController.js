// const Product = require('./../models/Product.model');
const Product = require('./../models/Product.model');

class ProductController {
  constructor() {}

  // Get all products
  async getProducts(req, res) {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Create a new product
  async createProduct(req, res) {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Update a product
  async updateProduct(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) return res.status(404).send('The product with the given ID was not found.');
      res.send(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Delete a product
  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndRemove(req.params.id);
      if (!product) return res.status(404).send('The product with the given ID was not found.');
      res.send(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new ProductController();


// class ProductController {
//   constructor() {}

//   // Get all products
//   async getProducts(req, res) {
//     try {
//       const products = await Product.find({});
//       res.json(products);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   }

//   // Create a new product (only admin)
//   async createProduct(req, res) {
//     if (req.user && req.user.role === 'admin') {
//       try {
//         const product = new Product(req.body);
//         await product.save();
//         res.status(201).send(product);
//       } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//       }
//     } else {
//       res.status(403).send('Only admins can perform this operation');
//     }
//   }

//   // Update a product (only admin)
//   async updateProduct(req, res) {
//     if (req.user && req.user.role === 'admin') {
//       try {
//         const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!product) return res.status(404).send('The product with the given ID was not found.');
//         res.send(product);
//       } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//       }
//     } else {
//       res.status(403).send('Only admins can perform this operation');
//     }
//   }

//   // Delete a product (only admin)
//   async deleteProduct(req, res) {
//     if (req.user && req.user.role === 'admin') {
//       try {
//         const product = await Product.findByIdAndRemove(req.params.id);
//         if (!product) return res.status(404).send('The product with the given ID was not found.');
//         res.send(product);
//       } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//       }
//     } else {
//       res.status(403).send('Only admins can perform this operation');
//     }
//   }
// }

// module.exports = new ProductController();
