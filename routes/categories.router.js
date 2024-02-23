const categoriesRouter = require("express").Router();

const categoriesController = require("../controllers/categories.controller");

categoriesRouter.post("/add-new-category", categoriesController.postNewCategory);

categoriesRouter.get("/all-categories", categoriesController.getAllCategories);

categoriesRouter.get("/categories-count", categoriesController.getCategoriesCount);

categoriesRouter.get("/all-categories-inside-the-page", categoriesController.getAllCategoriesInsideThePage);

categoriesRouter.delete("/:categoryId", categoriesController.deleteCategory);

categoriesRouter.put("/:categoryId", categoriesController.putCategory);

module.exports = categoriesRouter;