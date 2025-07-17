const { Op } = require("sequelize");
const models = require("../database/models");

const categories = models.categories;

const getAllCategoriesSequelize = async () => {
  const AllCategories = await categories.findAll();
  return AllCategories;
};

const getCategoryByIdSequelize = async (id) => {
  const category = await categories.findByPk(id);
  return category;
};

const getCategoryByNameSequelize = async (name) => {
  const category = await categories.findOne({
    where: {
      name: {
        [Op.iLike]: `%${name}%`,
      },
    },
  });
  return category;
};

module.exports = {
  getAllCategoriesSequelize,
  getCategoryByIdSequelize,
  getCategoryByNameSequelize,
};
