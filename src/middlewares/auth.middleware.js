const jwt = require("jsonwebtoken");
const { users } = require("../database/models");

const accessSecret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, accessSecret);
    req.user = decoded; // simpan user hasil decode ke `req`
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Missing refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret);

    // Optional: Cek apakah refreshToken ini valid (bisa simpan di DB dan validasi dari sana)
    const user = await users.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      accessSecret,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id, email: user.email },
      refreshSecret,
      { expiresIn: "7d" }
    );

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
}

module.exports = { authenticate, refreshToken };
