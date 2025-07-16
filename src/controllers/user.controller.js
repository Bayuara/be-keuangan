const {
  loginUserSequelize,
  registerUserSequelize,
  logoutUserSequelize,
  getAllUsersSequelize,
} = require("../services/userServices");

class UserController {
  static async getAllUsers(req, res) {
    try {
      const data = await getAllUsersSequelize();

      res.json({
        status: "Success",
        message: "Data retrieved successfully",
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await getUserByIdSequelize(userId);
      res.json({ status: "Success", message: "Data retrieved", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async register(req, res) {
    try {
      const { name, email, password, username } = req.body;

      if (!name || !email || !password || !username) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const user = await registerUserSequelize({
        name,
        email,
        password,
        username,
      });

      res.status(201).json({
        status: "Success",
        message: "User registered successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "username and password are required" });
      }

      const { user, accessToken, refreshToken } = await loginUserSequelize({
        username,
        password,
      });

      res.json({
        status: "Success",
        message: "Login successful",
        accessToken,
        refreshToken,
        data: {
          id: user.id,
          name: user.name,
          username: user.username,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async logout(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: "Missing refresh token" });
      }

      await logoutUser(refreshToken);

      return res.json({
        status: "Success",
        message: "Logged out successfully",
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = UserController;
