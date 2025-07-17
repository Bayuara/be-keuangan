const {
  createTransactionSequelize,
  deleteTransactionSequelize,
  getAllTransactionsSequelize,
  getTransactionByIdSequelize,
  updateTransactionSequelize,
} = require("../services/transactionServices");
const { getUserByIdSequelize } = require("../services/userServices");
const { getAccountByIdSequelize } = require("../services/accountServices");
const logger = require("../utils/logger");

class TransactionController {
  static async getAllTransactionsSequelize(req, res) {
    const { userId } = req.body;
    try {
      const data = await getAllTransactionsSequelize(userId);
      res
        .status(200)
        .json({ status: "Success", message: "Data retrieved", data });
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  static async getTransactionById(req, res) {
    const { transactionId } = req.params;
    const { userId } = req.body;

    try {
      const data = await getTransactionByIdSequelize(transactionId, userId);

      if (!data || data.userId !== userId) {
        return res.status(403).json({ error: "Forbidden access" });
      }

      res
        .status(200)
        .json({ status: "Success", message: "Data retrieved", data });
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  static async createTransaction(req, res) {
    const {
      type,
      amount,
      description,
      categoryId,
      accountId,
      date,
      isAccounted = false,
    } = req.body;
    const { userId } = req.body;
    try {
      const verifyUser = await getUserByIdSequelize(userId);
      if (!verifyUser || verifyUser.id !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const verifyAccount = await getAccountByIdSequelize(accountId);
      if (!verifyAccount) {
        return res.status(401).json({ error: "Money account not found" });
      }

      const changedIsAccounted = accountId ? true : false;

      const data = await createTransactionSequelize(
        type,
        amount,
        description,
        categoryId,
        accountId,
        userId,
        date,
        changedIsAccounted
      );
      res
        .status(201)
        .json({ status: "Success", message: "Transaction created", data });
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  static async updateTransaction(req, res) {
    const {
      type,
      amount,
      description,
      categoryId,
      accountId,
      date,
      isAccounted,
    } = req.body;
    const { userId } = req.body;
    try {
      const verifyUser = await getUserByIdSequelize(userId);

      if (!verifyUser || verifyUser.id !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const verifyAccount = await getAccountSequelize(accountId, userId);

      if (!verifyAccount) {
        return res.status(401).json({ error: "Money account not found" });
      }

      const verifyTransaction = await getTransactionByIdSequelize(
        transactionId,
        userId
      );
      if (!verifyTransaction) {
        return res.status(401).json({ error: "Transaction not found" });
      }

      const data = await updateTransactionSequelize(
        type,
        amount,
        description,
        categoryId,
        accountId,
        userId,
        date,
        (isAccounted = false)
      );
      res
        .status(200)
        .json({ status: "Success", message: "Transaction updated", data });
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  static async deleteTransaction(req, res) {
    const { transactionId, accountId } = req.params;
    const { userId } = req.body;
    try {
      const verifyUser = await getUserByIdSequelize(userId);
      if (!verifyUser || verifyUser.id !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const verifyAccount = await getAccountSequelize(accountId, userId);
      if (!verifyAccount) {
        return res.status(401).json({ error: "Money account not found" });
      }

      const verifyTransaction = await getTransactionByIdSequelize(
        transactionId,
        userId
      );
      if (!verifyTransaction) {
        return res.status(401).json({ error: "Transaction not found" });
      }

      const data = await deleteTransactionSequelize(
        transactionId,
        accountId,
        userId
      );
      res
        .status(200)
        .json({ status: "Success", message: "Transaction deleted", data });
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }
}

module.exports = TransactionController;
