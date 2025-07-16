const {
  createAccountSequelize,
  editAccountSequelize,
  getAccountSequelize,
  getAccountByNameSequelize,
  getAcountByTypeSequelize,
  getAllAccountsSequelize,
} = require("../services/accountServices");
const { getUserByIdSequelize } = require("../services/userServices");
const logger = require("../utils/logger");

class AccountController {
  static async createAccount(req, res) {
    const { name, balance, type, userId } = req.body;
    try {
      const data = await createAccountSequelize(name, balance, type, userId);

      res
        .json({ status: "Success", message: "Account created", data })
        .status(201);
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  static async getAllAccounts(req, res) {
    const { userId } = req.body;
    try {
      const data = await getAllAccountsSequelize(userId);
      res
        .json({ status: "Success", message: "Data retrieved", data })
        .status(201);
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  static async getAccount(req, res) {
    const { accountId } = req.params;
    const { userId } = req.body;
    try {
      const verifyUser = await getUserByIdSequelize(userId);

      if (!verifyUser || verifyUser.id !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const data = await getAccountSequelize(accountId, userId);
      res
        .json({ status: "Success", message: "Data retrieved", data })
        .status(201);
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  static async getAcountByType(req, res) {
    const { type, userId } = req.body;
    try {
      const data = await getAcountByTypeSequelize(type, userId);
      res
        .json({ status: "Success", message: "Data retrieved", data })
        .status(201);
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  static async getAccountByName(req, res) {
    const { name, userId } = req.body;
    try {
      const data = await getAccountByNameSequelize(name, userId);
      res
        .json({ status: "Success", message: "Data retrieved", data })
        .status(201);
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }

  static async editAccount(req, res) {
    const { accountId } = req.params;
    const { name, balance, type, userId } = req.body;

    console.log("accountId:", accountId);
    console.log("Payload:", { name, balance, type, userId });

    try {
      const verifyAccount = await getAccountSequelize(accountId, userId);

      if (!verifyAccount) {
        return res.status(401).json({ error: "Access denied" });
      }

      const data = await editAccountSequelize(
        userId,
        accountId,
        name,
        balance,
        type
      );
      res
        .status(201)
        .json({ status: "Success", message: "Account updated", data });
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }
}

module.exports = AccountController;
