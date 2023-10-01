const Product = require('./../models/Product.model');

class ProductController {
  constructor() {}

  // Get all products
  async getProducts(req, res) {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get a single product
  async getProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Add a new product
  async addProduct(req, res) {
    try {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      res.status(200).json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Update a product
  async updateProduct(req, res) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Delete a product
  async deleteProduct(req, res) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(deletedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new ProductController();
