class UserController {
  constructor() {}

  async;

  getStatus(req, res) {
    try {
      res.status(200).json({
        status: 200,
        message: "Route in great condition",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  }
}

module.exports = new UserController();
