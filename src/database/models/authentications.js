"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class authentications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      authentications.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  authentications.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
      },
      refreshToken: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "authentications",
    }
  );
  return authentications;
};
