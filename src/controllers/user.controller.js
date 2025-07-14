const users = require("../database/models/users");

class UserController {
  static async getAllUsers(req, res) {
    try {
      // Fetch users data from your database
      const data = await users.findAll();

      res.json({
        status: "Success",
        message: "Data retrieved successfully",
        data: data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Add more methods for handling user-related functionality
}

export default UserController;
