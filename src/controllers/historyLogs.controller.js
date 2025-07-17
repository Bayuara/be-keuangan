const {
  getHistoryLogsByAccountIdSequelize,
  getHistoryLogsByTransactionIdSequelize,
} = require("../services/historyLogsServices");
const logger = require("../utils/logger");

class HistoryLogsController {
  static async getHistoryLogsByAccountIdSequelize(req, res) {
    const { accountId } = req.params;
    try {
      const data = await getHistoryLogsByAccountIdSequelize(accountId);
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

  static async getHistoryLogsByTransactionIdSequelize(req, res) {
    const { transactionId } = req.params;
    try {
      const data = await getHistoryLogsByTransactionIdSequelize(transactionId);
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
}

module.exports = HistoryLogsController;
