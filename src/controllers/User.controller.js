const User = require("./../models/User.model");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const Cart = require("./../models/Cart.model");
const Logger = require("../middlewares/loggers/logger");
const transporter = require("../helpers/helpers");
const ejs = require("ejs");
const path = require("path");
const generateRandomString = require("./../helpers/GenerateRandom");
const dotenv = require("dotenv");

class UserController {
  constructor() {}
  // Register
  async Register(req, res) {
    try {
      if (req.body.password !== req.body.password_confirmation) {
        res.status(500).json({
          message: "Password or email is incorrect",
        });
      }

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.SHA256(
          req.body.password,
          process.env.PASS_SEC
        ).toString(),
        phoneNumber: req.body.phoneNumber,
      });

      await newUser.save();

      const info = await transporter.sendMail({
        from: process.env.GMAIL_USERNAME,
        to: `${req.body.email}`,
        subject: "Welcome to BeeKissed",
        text: `Hello ${req.body.username}`,
      });

      console.log("Message sent: %s", info.messageId);

      res
        .status(200)
        .json({ message: "Account created Successfully. Login to proceed." });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  }

  // Login
  // async Login(req, res) {
  //   try {
  //     const user = await User.findOne({ email: req.body.email });
  //     if (!user) {
  //       res
  //         .status(404)
  //         .json({ message: "Either password or email is incorrect" });
  //     }
  //     const hashed = CryptoJS.SHA256(
  //       req.body.password,
  //       process.env.PASS_SEC
  //     ).toString();

  //     const ifPasswordMatch = user.password === hashed ? true : false;

  //     if (!ifPasswordMatch) {
  //       return {
  //         status: 400,
  //         message: "Login failed. Either password or email is incorrect",
  //       };
  //     }

  //     const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SEC, {
  //       expiresIn: "12h",
  //     });

  // // Get the temporary cart from the request
  // const tempCart = req.body.tempCart;

  // // Find or create a cart for the user
  // let cart = await Cart.findOne({ userId: user.id });
  // if (!cart) {
  //   cart = new Cart({ userId: user.id });
  // }

  // Merge tempCart with existing cart
  // for (let item of tempCart) {
  //   const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === item.product._id);
  //   if (existingProductIndex >= 0) {
  //     cart.products[existingProductIndex].quantity += item.quantity;
  //   } else {
  //     cart.products.push({ productId: item.product._id, quantity: item.quantity });
  //   }
  // }

  // await cart.save();

  //     const { password, ...others } = user.toObject();

  //     res.status(200).json({
  //       message: "Login successful",
  //       data: {
  //         user: others,
  //         access_token: accessToken,
  //       },
  //     });
  //   } catch (error) {
  //     Logger.debug(error);
  //     return {
  //       status: 500,
  //       message: "User Login Failed",
  //       error: {
  //         errors: {
  //           details: error,
  //         },
  //       },
  //     };
  //   }
  // }

  async Login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        res
          .status(404)
          .json({ message: "Either password or email is incorrect" });
      }
      const hashed = CryptoJS.SHA256(
        req.body.password,
        process.env.PASS_SEC
      ).toString();

      const ifPasswordMatch = user.password === hashed ? true : false;

      if (!ifPasswordMatch) {
        return {
          status: 400,
          message: "Login failed. Either password or email is incorrect",
        };
      }

      // // Get the temporary cart from the request
      // const tempCart = req.body.tempCart;

      // // Find or create a cart for the user
      // let cart = await Cart.findOne({ userId: user.id });
      // if (!cart) {
      //   cart = new Cart({ userId: user.id });
      // }

      // // Merge tempCart with existing cart
      // for (let item of tempCart) {
      //   const existingProductIndex = cart.products.findIndex(
      //     (p) => p.productId.toString() === item.product._id
      //   );
      //   if (existingProductIndex >= 0) {
      //     cart.products[existingProductIndex].quantity += item.quantity;
      //   } else {
      //     cart.products.push({
      //       productId: item.product._id,
      //       quantity: item.quantity,
      //     });
      //   }
      // }

      // await cart.save();

      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SEC, {
        expiresIn: "12h",
      });

      const { password, ...others } = user.toObject();

      res.status(200).json({
        message: "Login successful",
        data: {
          user: others,
          access_token: accessToken,
        },
      });
    } catch (error) {
      Logger.debug(error);
      return {
        status: 500,
        message: "User Login Failed",
        error: {
          errors: {
            details: error,
          },
        },
      };
    }
  }

  // Forgot Password
  async ForgotPassword(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });

      const randomString = generateRandomString(8);

      if (user) {
        user.resetToken = randomString;
        user.save();

        // For sending the email
        const filePath = path.join(
          __dirname,
          "./../services/templates/forgotPassword.ejs"
        );

        // rendering the ejs file and passing the "verification" parameter"
        let html = await ejs.renderFile(filePath, {
          verification: randomString,
          name: "Martin",
        });

        const info = await transporter.sendMail({
          from: process.env.GMAIL_USERNAME,
          to: req.body.email,
          subject: "Forgot Your Password",
          html: html,
        });

        console.log("Message sent: %s", info.messageId);
        res.status(200).json({
          message:
            "Request has been recieved. An email has been sent with the reset token",
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      Logger.debug(error);
    }
  }

  // ForgotPasswordReset
  async ForgotPasswordReset(req, res) {
    try {
      const user = await User.findOne({ resetToken: req.body.token });
      if (user) {
        console.log(user);
        const hashed = CryptoJS.SHA256(req.body.newPassword).toString();
        user.password = hashed;

        // For sending the email
        const filePath = path.join(
          __dirname,
          "./../services/templates/resetPassword.ejs"
        );

        // rendering the ejs file and passing the "verification" parameter"
        let html = await ejs.renderFile(filePath, {
          name: user.username,
        });

        const info = await transporter.sendMail({
          from: process.env.GMAIL_USERNAME,
          to: user.email,
          subject: "Password changed",
          html: html,
        });

        console.log("Message sent: %s", info.messageId);

        user.resetToken = undefined;

        await user.save();
      }

      res
        .status(200)
        .json({ message: "You have successfully updated your password" });
    } catch (error) {
      Logger.debug(error);
    }
  }

  // Get user profile
  async Profile(req, res) {
    try {
      const user = await req.user;
      console.log(user.id);
    } catch (error) {
      Logger.debug(error);
      return {
        status: 500,
        message: "User Login Failed",
        error: {
          errors: {
            details: error,
          },
        },
      };
    }
  }
}

module.exports = new UserController();

// const User = require("./../models/User.model");
// const jwt = require("jsonwebtoken");
// const CryptoJS = require("crypto-js");
// const Cart = require('../models/Cart.model')
// const Logger = require("../middlewares/loggers/logger");

// class UserController {
//   constructor() {}
//   // Register
//   async Register(req, res) {
//     try {
//       if (req.body.password !== req.body.password_confirmation) {
//         res.status(500).json({
//           message: "Password or email is incorrect",
//         });
//       }

//       const newUser = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: CryptoJS.SHA256(
//           req.body.password,
//           process.env.PASS_SEC
//         ).toString(),
//         phoneNumber: req.body.phoneNumber,
//       });

//       await newUser.save();

//       res
//         .status(200)
//         .json({ message: "Account created Successfully. Login to proceed." });
//     } catch (error) {
//       res.status(500).json({
//         status: 500,
//         message: error,
//       });
//     }
//   }

//   // Login
//   async Login(req, res) {
//     try {
//       const user = await User.findOne({ username: req.body.username });

//       if (!user) {
//         res
//           .status(404)
//           .json({ message: "Either password or email is incorrect" });
//       }
//       const hashed = CryptoJS.SHA256(
//         req.body.password,
//         process.env.PASS_SEC
//       ).toString();

//       const ifPasswordMatch = user.password === hashed ? true : false;

//       if (!ifPasswordMatch) {
//         return {
//           status: 400,
//           message: "Login failed. Either password or email is incorrect",
//         };
//       }

//       const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SEC, {
//         expiresIn: "12h",
//       });

//       const { password, ...others } = user.toObject();

//       // Merge the temporary cart with the user's cart in the backend
//       let tempCart = req.body.tempCart ? JSON.parse(req.body.tempCart) : [];
//       let cart;
//       if (req.session.cartId) {
//         cart = await Cart.findById(req.session.cartId);

//       } else {
//         cart = new Cart();
//         await cart.save();
//         req.session.cartId = cart._id;
//       }

//       for (let item of tempCart) {
//         const itemIndex = cart.products.findIndex(p => p.product.toString() === item.product);
//         if (itemIndex > -1) {
//           cart.products[itemIndex].quantity += item.quantity;
//         } else {
//           cart.products.push({ product: item.product, quantity: item.quantity });
//         }
//       }

//       await cart.save();

//       res.status(200).json({
//         message: "Login successful",
//         data: {
//           user: others,
//           access_token: accessToken,
//           cart,
//         },
//       });
//     } catch (error) {
//       Logger.debug(error);
//       return {
//         status: 500,
//         message: "User Login Failed",
//         error: {
//           errors: {
//             details: error,
//           },
//         },
//       };
//     }
//   }
//   // async Login(req, res) {
//   //   try {
//   //     const user = await User.findOne({ username: req.body.username });

//   //     if (!user) {
//   //       res
//   //         .status(404)
//   //         .json({ message: "Either password or email is incorrect" });
//   //     }
//   //     const hashed = CryptoJS.SHA256(
//   //       req.body.password,
//   //       process.env.PASS_SEC
//   //     ).toString();

//   //     const ifPasswordMatch = user.password === hashed ? true : false;

//   //     if (!ifPasswordMatch) {
//   //       return {
//   //         status: 400,
//   //         message: "Login failed. Either password or email is incorrect",
//   //       };
//   //     }

//   //     const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SEC, {
//   //       expiresIn: "12h",
//   //     });

//   //     const { password, ...others } = user.toObject();

//   //     res.status(200).json({
//   //       message: "Login successful",
//   //       data: {
//   //         user: others,
//   //         access_token: accessToken,
//   //       },
//   //     });
//   //   } catch (error) {
//   //     Logger.debug(error);
//   //     return {
//   //       status: 500,
//   //       message: "User Login Failed",
//   //       error: {
//   //         errors: {
//   //           details: error,
//   //         },
//   //       },
//   //     };
//   //   }
//   // }

//   // Get user profile
//   async Profile(req, res) {
//     try {
//       const user = await req.user;
//       console.log(user.id);
//     } catch (error) {
//       Logger.debug(error);
//       return {
//         status: 500,
//         message: "User Login Failed",
//         error: {
//           errors: {
//             details: error,
//           },
//         },
//       };
//     }
//   }
// }

// module.exports = new UserController();
