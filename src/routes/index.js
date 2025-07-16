const express = require("express");
const userRouter = require("./user.router.js");
const authRouter = require("./auth.router.js");
const accountRouter = require("./account.router.js");

const router = express.Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/accounts", accountRouter);

module.exports = router;
