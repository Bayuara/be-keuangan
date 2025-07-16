const express = require("express");
const CategoryController = require("../controllers/category.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const categoryRouter = express.Router();

categoryRouter.get("/", authenticate, CategoryController.getAllCategories);
categoryRouter.get("/:id", authenticate, CategoryController.getCategoryById);
categoryRouter.get("/name", authenticate, CategoryController.getCategoryByName);

module.exports = categoryRouter;
