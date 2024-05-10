const favoriteProductsRouter = require("express").Router();

const favoriteProductsController = require("../controllers/favorite_products.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

favoriteProductsRouter.post("/add-new-favorite-product/:productId", validateJWT, favoriteProductsController.postNewFavoriteProducts);

module.exports = favoriteProductsRouter;