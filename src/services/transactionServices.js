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
  isAccounted = false,
  transactionId // ID transaksi yang akan diupdate
) => {
  const result = await sequelize.transaction(async (t) => {
    // Dapatkan transaksi yang akan diupdate
    const existingTransaction = await transactions.findOne({
      where: { id: transactionId },
      transaction: t,
    });

    if (!existingTransaction) {
      throw new Error("Transaction not found");
    }

    // Dapatkan account saat ini
    const currentAccount = await accounts.findOne({
      where: { id: accountId },
      transaction: t,
    });

    if (!currentAccount) {
      throw new Error("Account not found");
    }

    let previousBalance = currentAccount.balance;
    let newBalance = previousBalance;

    // Jika transaksi lama sudah di-account, kembalikan dulu balance-nya
    if (existingTransaction.isAccounted) {
      if (existingTransaction.type === "income") {
        await accounts.decrement(
          { balance: existingTransaction.amount },
          { where: { id: existingTransaction.accountId }, transaction: t }
        );
        previousBalance = previousBalance - existingTransaction.amount;
      } else {
        await accounts.increment(
          { balance: existingTransaction.amount },
          { where: { id: existingTransaction.accountId }, transaction: t }
        );
        previousBalance = previousBalance + existingTransaction.amount;
      }
    }

    // Update transaksi
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
      {
        where: { id: transactionId },
        transaction: t,
      }
    );

    // Terapkan balance baru jika isAccounted = true
    newBalance = previousBalance;
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

    // Buat history log untuk update
    await historyLogs.create(
      {
        accountId,
        transactionId: transactionId,
        previousBalance: previousBalance,
        changedAmount: type === "income" ? amount : -amount,
        newBalance: newBalance,
        type,
      },
      { transaction: t }
    );

    // Return updated transaction
    const updatedTransaction = await transactions.findOne({
      where: { id: transactionId },
      transaction: t,
    });

    return updatedTransaction;
  });

  return result;
};

// const deleteTransactionSequelize = async (
//   transactionId,
//   accountId,
//   amount,
//   isAccounted
// ) => {
//   const result = await sequelize.transaction(async (t) => {
//     if (isAccounted) {
//       const findAccount = await accounts.findByPk(accountId);

//       if (!findAccount) {
//         throw new Error("Account not found");
//       }

//       type === "income"
//         ? await accounts.increment(
//             { balance: amount },
//             { where: { id: accountId }, transaction: t }
//           )
//         : await accounts.decrement(
//             { balance: amount },
//             { where: { id: accountId }, transaction: t }
//           );
//     }

//     await transactions.destroy({ where: { transactionId }, transaction: t });
//   });

//   return result;
// };

const deleteTransactionSequelize = async (transactionId) => {
  const result = await sequelize.transaction(async (t) => {
    // Dapatkan transaksi yang akan dihapus
    const existingTransaction = await transactions.findOne({
      where: { id: transactionId },
      transaction: t,
    });

    if (!existingTransaction) {
      throw new Error("Transaction not found");
    }

    // Dapatkan account terkait
    const currentAccount = await accounts.findOne({
      where: { id: existingTransaction.accountId },
      transaction: t,
    });

    if (!currentAccount) {
      throw new Error("Account not found");
    }

    let previousBalance = currentAccount.balance;
    let newBalance = previousBalance;

    if (existingTransaction.isAccounted) {
      if (existingTransaction.type === "income") {
        // income dihapus, kurangi balance
        await accounts.decrement(
          { balance: existingTransaction.amount },
          { where: { id: existingTransaction.accountId }, transaction: t }
        );
        newBalance = previousBalance - existingTransaction.amount;
      } else {
        await accounts.increment(
          { balance: existingTransaction.amount },
          { where: { id: existingTransaction.accountId }, transaction: t }
        );
        newBalance = previousBalance + existingTransaction.amount;
      }
    }

    // Buat history log untuk penghapusan
    await historyLogs.create(
      {
        accountId: existingTransaction.accountId,
        transactionId: transactionId,
        previousBalance: previousBalance,
        changedAmount:
          existingTransaction.type === "income"
            ? -existingTransaction.amount
            : existingTransaction.amount,
        newBalance: newBalance,
        type: `deleted_${existingTransaction.type}`,
      },
      { transaction: t }
    );

    // Hapus transaksi
    const deletedCount = await transactions.destroy({
      where: { id: transactionId },
      transaction: t,
    });

    if (deletedCount === 0) {
      throw new Error("Failed to delete transaction");
    }

    return {
      deleted: true,
      transactionId: transactionId,
      accountId: existingTransaction.accountId,
      balanceChange: newBalance - previousBalance,
    };
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
