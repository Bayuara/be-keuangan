const {
  getAllCategoriesSequelize,
  getCategoryByIdSequelize,
  getCategoryByNameSequelize,
} = require("../services/categoryServices");

const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesSequelize();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await getCategoryByIdSequelize(id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getCategoryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const category = await getCategoryByNameSequelize(name);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
};
