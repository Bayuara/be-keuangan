"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("historyLogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      accountId: {
        type: Sequelize.INTEGER,
        references: {
          model: "accounts",
          key: "id",
        },
      },
      transactionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "transactions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      previousBalance: {
        type: Sequelize.DECIMAL(15, 2),
      },
      changedAmount: {
        type: Sequelize.DECIMAL(15, 2),
      },
      newBalance: {
        type: Sequelize.DECIMAL(15, 2),
      },
      type: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("historyLogs");
  },
};
