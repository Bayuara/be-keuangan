const models = require("../database/models");
const { sequelize, transactions, accounts, categories, users, historyLogs } =
  models;

const getAllTransactionsSequelize = async (userId) => {
  const result = await transactions.findAll({ where: { userId } });
  return result;
};

const getTransactionByIdSequelize = async (id) => {
  const transaction = await transactions.findByPk(id);
  return transaction;
};

const createTransactionSequelize = async (
  type, //income or outcome/expense
  amount,
  description,
  categoryId,
  accountId,
  userId,
  date,
  isAccounted = false
) => {
  const result = await sequelize.transaction(async (t) => {
    const currentAccount = await accounts.findOne({
      where: { id: accountId },
      transaction: t,
    });

    if (!currentAccount) {
      throw new Error("Account not found");
    }

    const previousBalance = currentAccount.balance;
    let newBalance = previousBalance;

    if (isAccounted) {
      if (type === "income") {
        await accounts.increment(
          { balance: amount },
          { where: { id: accountId }, transaction: t }
        );
        newBalance = previousBalance + amount;
      } else {
        await accounts.decrement(
          { balance: amount },
          { where: { id: accountId }, transaction: t }
        );
        newBalance = previousBalance - amount;
      }
    }

    const transactionResult = await transactions.create(
      {
        type,
        amount,
        description,
        categoryId,
        accountId,
        userId,
        date,
        isAccounted,
      },
      { transaction: t }
    );

    await historyLogs.create(
      {
        accountId,
        transactionId: transactionResult.id,
        previousBalance: previousBalance,
        changedAmount: type === "income" ? amount : -amount,
        newBalance: newBalance,
        type,
      },
      { transaction: t }
    );
    return transactionResult;
  });
  return result;
};

const updateTransactionSequelize = async (
  type, //income or outcome/expense
  amount,
  description,
  categoryId,
  accountId,
  userId,
  date,
  isAccounted = false
) => {
  const result = await sequelize.transactions(async (t) => {
    await transactions.update(
      {
        type,
        amount,
        description,
        categoryId,
        accountId,
        userId,
        date,
        isAccounted,
      },
      { transaction: t }
    );

    if (isAccounted) {
      const findAccount = await accounts.findByPk(accountId);

      if (!findAccount) {
        throw new Error("Account not found");
      }

      type === "income"
        ? await models.accounts.increment(
            { balance: amount },
            { where: { id: accountId }, transaction: t }
          )
        : await models.accounts.decrement(
            { balance: -amount },
            { where: { id: accountId }, transaction: t }
          );
    }
    return result;
  });
};

const deleteTransactionSequelize = async (
  transactionId,
  accountId,
  amount,
  isAccounted
) => {
  const result = await sequelize.transaction(async (t) => {
    if (isAccounted) {
      const findAccount = await accounts.findByPk(accountId);

      if (!findAccount) {
        throw new Error("Account not found");
      }

      type === "income"
        ? await accounts.increment(
            { balance: amount },
            { where: { id: accountId }, transaction: t }
          )
        : await accounts.decrement(
            { balance: amount },
            { where: { id: accountId }, transaction: t }
          );
    }

    await transactions.destroy({ where: { transactionId }, transaction: t });
  });

  return result;
};

module.exports = {
  createTransactionSequelize,
  getAllTransactionsSequelize,
  getTransactionByIdSequelize,
  updateTransactionSequelize,
  deleteTransactionSequelize,
};
