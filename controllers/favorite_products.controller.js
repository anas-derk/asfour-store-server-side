const { getResponseObject } = require("../global/functions");

const favoriteProductsOPerationsManagmentFunctions = require("../models/favorite_products.model");

async function postNewFavoriteProducts(req, res) {
    try{
        res.json(await favoriteProductsOPerationsManagmentFunctions.addNewFavoriteProduct(req.data._id, req.params.productId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postNewFavoriteProducts,
}