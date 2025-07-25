"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      accounts.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
      });

      accounts.hasMany(models.transactions, {
        foreignKey: "accountId",
        as: "transactions",
      });

      accounts.hasMany(models.historyLogs, {
        foreignKey: "accountId",
        as: "historyLogs",
      });
    }
  }
  accounts.init(
    {
      name: DataTypes.STRING,
      balance: DataTypes.DECIMAL,
      type: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "accounts",
    }
  );
  return accounts;
};
