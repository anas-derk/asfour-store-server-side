const categoriesRouter = require("express").Router();

const categoriesController = require("../controllers/categories.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

categoriesRouter.post("/add-new-category", validateJWT, categoriesController.postNewCategory);

categoriesRouter.get("/all-categories", categoriesController.getAllCategories);

categoriesRouter.get("/categories-count", categoriesController.getCategoriesCount);

categoriesRouter.get("/all-categories-inside-the-page", categoriesController.getAllCategoriesInsideThePage);

categoriesRouter.delete("/:categoryId", validateJWT, categoriesController.deleteCategory);

categoriesRouter.put("/:categoryId", validateJWT, categoriesController.putCategory);

module.exports = categoriesRouter;