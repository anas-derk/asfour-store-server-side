const { getResponseObject } = require("../global/functions");

const favoriteProductsOPerationsManagmentFunctions = require("../models/favorite_products.model");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "userId") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function postNewFavoriteProducts(req, res) {
    try{
        res.json(await favoriteProductsOPerationsManagmentFunctions.addNewFavoriteProduct(req.data._id, req.params.productId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getFavoriteProductsByProductsIdsAndUserId(req, res) {
    try{
        res.json(await favoriteProductsOPerationsManagmentFunctions.getFavoriteProductsByProductsIdsAndUserId(req.data._id, req.body.productsIds));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getFavoriteProductsCount(req, res) {
    try {
        res.json(await favoriteProductsOPerationsManagmentFunctions.getFavoriteProductsCount(getFiltersObject({ ...req.query, userId: req.data._id })));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllFavoriteProductsInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await favoriteProductsOPerationsManagmentFunctions.getAllFavoriteProductsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject({ ...filters, userId: req.data._id })));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteFavoriteProduct(req, res) {
    try{
        res.json(await favoriteProductsOPerationsManagmentFunctions.deleteFavoriteProduct(req.data._id, req.params.productId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postNewFavoriteProducts,
    getFavoriteProductsCount,
    getAllFavoriteProductsInsideThePage,
    getFavoriteProductsByProductsIdsAndUserId,
    deleteFavoriteProduct
}