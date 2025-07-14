const express = require("express");
const UserController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const userRouter = express.Router();
// const UserController = require("../controllers/user.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

// Handle the /users endpoint
userRouter.get("/", authenticate, UserController.getAllUsers);

// Add more routes for the /users endpoint as needed

export default userRouter;
