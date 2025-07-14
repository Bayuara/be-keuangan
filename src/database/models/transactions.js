"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
      });
      transactions.belongsTo(models.accounts, {
        foreignKey: "accountId",
        as: "account",
      });
      transactions.belongsTo(models.categories, {
        foreignKey: "categoryId",
        as: "category",
      });
    }
  }
  transactions.init(
    {
      type: DataTypes.STRING,
      amount: DataTypes.FLOAT,
      description: DataTypes.STRING,
      accountId: {
        type: DataTypes.INTEGER,
        references: { model: "accounts", key: "id" },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: { model: "categories", key: "id" },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
      },
      date: DataTypes.DATE,
      isAccounted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "transactions",
    }
  );
  return transactions;
};
