const models = require("../database/models");
const { Op } = require("sequelize");

const accounts = models.accounts;
const user = models.users;

const createAccountSequelize = async (name, balance, type, userId) => {
  return await accounts.create({
    name,
    balance,
    type,
    userId,
  });
};

const getAllAccountsSequelize = async (userId) => {
  return await accounts.findAll({
    where: {
      userId,
    },
  });
};

const getAccountSequelize = async (accountId, userId) => {
  return await accounts.findOne({
    where: {
      id: accountId,
      userId: userId,
    },
  });
};

const getAcountByTypeSequelize = async (userId, type) => {
  return await accounts.findAll({
    where: {
      userId,
      type,
    },
  });
};

const getAccountByNameSequelize = async (userId, name) => {
  return await accounts.findOne({
    where: {
      userId,
      name: {
        [Op.iLike]: name, // exact match (case-insensitive)
      },
    },
  });
};

const editAccountSequelize = async (userId, accountId, name, balance, type) => {
  // return await accounts.update(
  //   {
  //     name,
  //     balance,
  //     type,
  //     updatedAt: new Date(),
  //   },
  //   {
  //     where: {
  //       id: accountId,
  //       userId: userId,
  //     },
  //     returning: true,
  //   }
  // );
  try {
    return await accounts.update(
      {
        name,
        balance,
        type,
        updatedAt: new Date(),
      },
      {
        where: {
          id: accountId,
          userId: userId,
        },
        returning: true,
      }
    );
  } catch (error) {
    console.error("Sequelize update error:", error);
    throw error;
  }
};

module.exports = {
  createAccountSequelize,
  getAllAccountsSequelize,
  getAccountSequelize,
  getAcountByTypeSequelize,
  getAccountByNameSequelize,
  editAccountSequelize,
};
