const express = require("express");
const HistoryLogsController = require("../controllers/historyLogs.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const historyLogsRouter = express.Router();

historyLogsRouter.get(
  "/account/:accountId",
  authenticate,
  HistoryLogsController.getHistoryLogsByAccountIdSequelize
);
historyLogsRouter.get(
  "/transaction/:transactionId",
  authenticate,
  HistoryLogsController.getHistoryLogsByTransactionIdSequelize
);

module.exports = historyLogsRouter;
