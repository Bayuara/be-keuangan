const jwt = require("jsonwebtoken");
const { authentications, users } = require("../database/models");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/token");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body || {};

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    // Cek apakah token ada di DB
    const stored = await authentications.findOne({ where: { refreshToken } });
    if (!stored) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Verifikasi token
    const decoded = verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({ id: decoded.id });

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = { refreshToken };
