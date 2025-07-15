const jwt = require("jsonwebtoken");
const { authentications, users } = require("../database/models");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/token");

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
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Refresh token verification error:", err.message);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = { refreshToken };
