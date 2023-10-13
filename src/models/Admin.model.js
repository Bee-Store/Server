const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // phoneNumber: {
    //   type: Number,
    //   required: true,
    //   unique: true,
    // },
    password: {
      type: String,
      required: true,
      min: [6, "The password is not strong enough"],
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    resetToken: { type: String, required: false },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Admin", adminSchema);
