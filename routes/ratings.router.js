const ratingsRouter = require("express").Router();

const ratingsController = require("../controllers/ratings.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

ratingsRouter.post("/select-product-rating", validateJWT, ratingsController.postSelectProductRating);

module.exports = ratingsRouter;