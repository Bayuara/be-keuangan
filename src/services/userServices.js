const bcrypt = require("bcrypt");
const models = require("../database/models");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const users = models.users;
const authentications = models.authentications;

const registerUserSequelize = async ({ name, email, password, username }) => {
  const existingUser = await users.findOne({ where: { email } });
  if (existingUser) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await users.create({
    name,
    email,
    username,
    password: hashedPassword,
  });

  return newUser;
};

const loginUserSequelize = async ({ username, password }) => {
  const user = await users.findOne({ where: { username } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const payload = { id: user.id, username: user.username };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await authentications.destroy({ where: { userId: user.id } });
  await authentications.create({ userId: user.id, refreshToken });

  return { user, accessToken, refreshToken };
};

const logoutUserSequelize = async (refreshToken) => {
  await authentications.destroy({ where: { refreshToken } });
};

const getUserByIdSequelize = async (id) => {
  const user = await users.findByPk(id);
  if (!user) throw new Error("User not found");
  return user;
};

const getAllUsersSequelize = async () => {
  const result = await users.findAll();
  result.map((user) => (user.password = undefined));
  return result;
};

module.exports = {
  registerUserSequelize,
  loginUserSequelize,
  logoutUserSequelize,
  getUserByIdSequelize,
  getAllUsersSequelize,
};
