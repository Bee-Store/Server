const { faker } = require("@faker-js/faker");
const Admin = require("./../models/Admin.model");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
dotenv.config();

// const seedAdmin = async () => {
//   try {
//     const username = faker.internet.userName();
//     const email = faker.internet.email();
//     const password = CryptoJS.SHA256("admin", process.env.PASS_SEC).toString();

//     const newUser = await Admin.create({
//       username,
//       email,
//       password,
//     });

//     console.log("Admin user seeded:", newUser);
//   } catch (error) {
//     console.error("Error seeding admin:", error);
//   }
// };

const seedAdmin = async () => {
  let retries = 3;

  while (retries > 0) {
    try {
      const username = faker.internet.userName();
      const email = faker.internet.email();
      const password = CryptoJS.SHA256(
        "admin",
        process.env.PASS_SEC
      ).toString();

      const newUser = await Admin.create({
        username,
        email,
        password,
      });

      console.log("Admin user seeded:", newUser);
      break; // Break the loop if successful
    } catch (error) {
      console.error("Error seeding admin:", error);
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }
  }
};

seedAdmin();


seedAdmin();
