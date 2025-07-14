"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("categories", [
      {
        name: "Gaji",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Uang Makan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Investasi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Transportasi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Hiburan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pendidikan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tagihan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kesehatan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lainnya",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("categories", null, {});
  },
};
