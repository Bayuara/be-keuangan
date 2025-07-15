const bcrypt = require("bcrypt");
const models = require("../database/models");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const users = models.users;
const authentications = models.authentications;

const registerUser = async ({ name, email, password }) => {
  const existingUser = await users.findOne({ where: { email } });
  if (existingUser) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await users.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

const loginUser = async ({ email, password }) => {
  const user = await users.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const payload = { id: user.id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Only 1 refreshToken per user (optional rule)
  await authentications.destroy({ where: { userId: user.id } });
  await authentications.create({ userId: user.id, refreshToken });

  return { user, accessToken, refreshToken };
};

const logoutUser = async (refreshToken) => {
  await authentications.destroy({ where: { refreshToken } });
};

module.exports = { registerUser, loginUser, logoutUser };
