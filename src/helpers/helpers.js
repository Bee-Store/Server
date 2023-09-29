const bcrypt = require("bcrypt");
const generateSecurePassword = async (password) => {
  const salt = await bcrypt.genSalt(15);
  const hashed = bcrypt.hashSync(password, salt);

  return hashed;
};

module.exports = {
  generateSecurePassword,
};
