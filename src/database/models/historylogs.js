"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class historyLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      historyLogs.belongsTo(models.accounts, {
        foreignKey: "accountId",
        as: "account",
      });
      historyLogs.belongsTo(models.transactions, {
        foreignKey: "transactionId",
        as: "transaction",
      });
    }
  }
  historyLogs.init(
    {
      accountId: {
        type: DataTypes.INTEGER,
        references: { model: "accounts", key: "id" },
      },
      transactionId: {
        type: DataTypes.INTEGER,
        references: { model: "transactions", key: "id" },
      },
      previousBalance: DataTypes.DECIMAL,
      changedAmount: DataTypes.DECIMAL,
      newBalance: DataTypes.DECIMAL,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "historyLogs",
    }
  );
  return historyLogs;
};
