const express = require("express");
const UserController = require("../controllers/user.controller");
const {
  authenticate,
} = require("../middlewares/auth.middleware");

const userRouter = express.Router();

userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);
userRouter.get("/", authenticate, UserController.getAllUsers);

// Add more routes for the /users endpoint as needed

module.exports = userRouter;
