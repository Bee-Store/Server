const Product = require('./../models/Product.model');
const multer = require('multer');

// Multer configuration for storing images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Define the filename for uploaded files
  }
});

const upload = multer({ storage: storage });

class ProductController {
  constructor() {}

  // ... (other methods remain unchanged)

  // Add a new product with image upload
  async addProduct(req, res) {
    try {
      // Middleware to handle file upload
      upload.single('image')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          return res.status(400).json({ message: 'Error uploading file' });
        } else if (err) {
          // An unknown error occurred when uploading.
          return res.status(500).json({ message: 'Server error' });
        }

        // File upload successful, create a new product
        const { body, file } = req;
        const newProduct = new Product({
          ...body,
          imageUrl: file.path // Save the path of the uploaded image in the database
        });

        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // ... (other methods remain unchanged)
}

module.exports = new ProductController();
