import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import users from "../database/models/users";
import authentications from "../database/models/authentications";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

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

      const existingUser = await users.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await users.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        status: "Success",
        message: "User registered successfully",
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
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

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await users.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // Simpan refreshToken ke DB (hapus yg lama jika ada)
      await authentications.destroy({ where: { userId: user.id } });
      await authentications.create({ userId: user.id, refreshToken });

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

      await authentications.destroy({ where: { refreshToken } });

      return res.json({
        status: "Success",
        message: "Logged out successfully",
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default UserController;
