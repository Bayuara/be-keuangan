const express = require("express");
const UserController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const logger = require("../utils/logger");

const userRouter = express.Router();

userRouter.get("/", authenticate, UserController.getAllUsers);
userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);

module.exports = userRouter;
