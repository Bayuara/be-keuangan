const express = require("express");
const CategoryController = require("../controllers/category.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const categoryRouter = express.Router();

categoryRouter.get("/", authenticate, CategoryController.getAllCategories);
categoryRouter.get(
  "/by-name/:name",
  authenticate,
  CategoryController.getCategoryByName
);
categoryRouter.get("/:id", authenticate, CategoryController.getCategoryById);

module.exports = categoryRouter;
