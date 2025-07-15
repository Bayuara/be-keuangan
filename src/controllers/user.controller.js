const users = require("../database/models/users");
const {
  loginUser,
  registerUser,
  logoutUser,
} = require("../services/authServices");
const { generateAccessToken } = require("../utils/token");
const models = require("../database/models/authentications");
const jwt = require("jsonwebtoken");

class UserController {
  static async getAllUsers(req, res) {
    try {
      const data = await users.findAll();
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

  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const user = await registerUser({ name, email, password });

      res.status(201).json({
        status: "Success",
        message: "User registered successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      console.log(email, password);

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const { user, accessToken, refreshToken } = await loginUser({
        email,
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
          email: user.email,
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

  static async refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
      // Cek apakah token ada di DB
      const stored = await models.findOne({
        where: { refreshToken },
      });
      if (!stored) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Verifikasi token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

      const newAccessToken = generateAccessToken({ id: decoded.id });

      return res.status(200).json({
        accessToken: newAccessToken,
      });
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }
  }
}

module.exports = UserController;
