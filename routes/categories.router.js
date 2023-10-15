const categoriesRouter = require("express").Router();

const categoriesController = require("../controllers/categories.controller");

categoriesRouter.post("/add-new-category", categoriesController.postNewCategory);

categoriesRouter.get("/all-categories", categoriesController.getAllCategories);

categoriesRouter.delete("/:categoryId", categoriesController.deleteCategory);

categoriesRouter.put("/:categoryId", categoriesController.putCategory);

module.exports = categoriesRouter;