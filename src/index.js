const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Logger = require("./middlewares/loggers/logger");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected succssfully"))
  .catch((err) => console.log(err));

app.use(express.json());
app.listen(process.env.PORT || 5000, () => {
  Logger.debug("Server started");
  Logger.info(`Running on 👉🏼 ${process.env.PORT}`);
});
