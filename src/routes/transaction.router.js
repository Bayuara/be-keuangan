const express = require("express");
const TransactionController = require("../controllers/transaction.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const transactionRouter = express.Router();

transactionRouter.get(
  "/",
  authenticate,
  TransactionController.getAllTransactionsSequelize
);
transactionRouter.get(
  "/:transactionId",
  authenticate,
  TransactionController.getTransactionById
);
transactionRouter.post(
  "/create",
  authenticate,
  TransactionController.createTransaction
);
transactionRouter.put(
  "/:transactionId",
  authenticate,
  TransactionController.updateTransaction
);
transactionRouter.delete(
  "/:transactionId",
  authenticate,
  TransactionController.deleteTransaction
);

module.exports = transactionRouter;
