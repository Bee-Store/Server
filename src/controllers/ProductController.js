const Product = require("./../models/Product.model");
const multer = require("multer");

// Multer configuration for storing images
// Multer configuration for storing images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Define the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Define the filename for uploaded files
  },
});

const upload = multer({ storage: storage }).single("image");

class ProductController {
  constructor() {}

  // Get all products
  async getProducts(req, res) {
    try {
      const products = await Product.find({});

      // Get the paths to the uploaded images
      // const productImages = products.map(product => product.image);

      // Send the images to the client
      // res.status(200).json({ products, productImages });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Get a single product
  async getProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Add a new product
  // Add a new product
  addProduct(req, res) {
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error uploading file" });
      }
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "Please upload a file" });
      }

      const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        image: `http://localhost:5000/${req.file.path}`, // Save the path of the uploaded image in the database
      });

      newProduct
        .save()
        .then(() => res.status(200).send("success"))
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Error saving product" });
        });
    });
  }

  // Update a product
  async updateProduct(req, res) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedProduct)
        return res.status(404).json({ message: "Product not found" });
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Delete a product
  async deleteProduct(req, res) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct)
        return res.status(404).json({ message: "Product not found" });
      res.status(200).json(deletedProduct);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new ProductController();
