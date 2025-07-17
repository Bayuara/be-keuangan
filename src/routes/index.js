const express = require("express");
const userRouter = require("./user.router.js");
const authRouter = require("./auth.router.js");
const accountRouter = require("./account.router.js");
const categoryRouter = require("./category.router.js");
const transactionRouter = require("./transaction.router.js");
const historyLogsRouter = require("./historyLogs.router.js");

const router = express.Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/accounts", accountRouter);
router.use("/categories", categoryRouter);
router.use("/transactions", transactionRouter);
router.use("/history-logs", historyLogsRouter);

module.exports = router;
