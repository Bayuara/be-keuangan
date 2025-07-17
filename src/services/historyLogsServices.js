const models = require("../database/models");

const historyLogs = models.historyLogs;

const getHistoryLogsByAccountIdSequelize = async (accountId) => {
  return await historyLogs.findAll({
    where: {
      accountId,
    },
  });
};

const getHistoryLogsByTransactionIdSequelize = async (transactionId) => {
  return await historyLogs.findAll({
    where: {
      transactionId,
    },
  });
};

module.exports = {
  getHistoryLogsByAccountIdSequelize,
  getHistoryLogsByTransactionIdSequelize,
};
