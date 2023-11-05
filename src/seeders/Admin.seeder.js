const { faker } = require("@faker-js/faker");
const Admin = require("./../models/Admin.model");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
dotenv.config();
const seedAdmin = (req, res) => {
  try {
    const newUser = new Admin({
        username: faker.person.firstName(),
        email: faker.internet.email(),  
      password: CryptoJS.SHA256("testing", process.env.PASS_SEC).toString(),
    });

    newUser.save();
    console.log(newUser);
  } catch (error) {
    console.error(error);
  }
};

// module.exports = seedAdmin;
seedAdmin();
