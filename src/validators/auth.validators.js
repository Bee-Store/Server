const jwt = require("jsonwebtoken");

const authenticateRequest = () => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
          if (err) return res.status(403).json("Token is not valid");

          req.user = user;
          next();
        });
      } else {
        return res.status(401).json("You are not authenticated!");
      }
    } catch (error) {
      return res.status(401).json({
        status: 401,
        error: {
          message: "Authentication failed. Login in again to proceed",
        },
      });
    }
  };
};

module.exports = authenticateRequest;
