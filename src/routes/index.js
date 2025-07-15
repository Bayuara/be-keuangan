const express = require("express");
const userRouter = require("./user.router.js");

const router = express.Router();

router.use("/users", userRouter);

module.exports = router;
