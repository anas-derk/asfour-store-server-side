const ratingsRouter = require("express").Router();

const ratingsController = require("../controllers/ratings.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

ratingsRouter.post("/add-new-product-rating", validateJWT, ratingsController.postAddNewProductRating);

module.exports = ratingsRouter;