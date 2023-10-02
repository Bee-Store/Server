const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require('express-session'); 
const Logger = require("./middlewares/loggers/logger");
const cors = require('cors'); // Import cors

// Importing routes
const authRoute = require("./routes/auth.route");
const cartRoute = require("./routes/cart.route");
const productRoute = require("./routes/product.route");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected succssfully"))
  .catch((err) => console.log(err));

app.use(express.json());

// Use cors middleware
app.use(cors());

// Session setup
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if your app is on https
}));

app.use("/api/auth", authRoute)
app.use("/api/cart", cartRoute)
app.use("/api/products", productRoute) 


app.listen(process.env.PORT || 5000, () => {
  Logger.debug("Server started");
  Logger.info(`Running on 👉🏼 ${process.env.PORT}`);
});
