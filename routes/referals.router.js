const referalsRouter = require("express").Router();

const referalsController = require("../controllers/referals.controller");

referalsRouter.post("/add-new-referal", referalsController.postAddNewReferal);

referalsRouter.get("/products-count", referalsController.getProductReferalsCount);

referalsRouter.get("/all-product-referals-inside-the-page/:productId", referalsController.getAllProductReferalsInsideThePage);

module.exports = referalsRouter;