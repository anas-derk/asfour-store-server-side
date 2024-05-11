const { getResponseObject } = require("../global/functions");

const walletOPerationsManagmentFunctions = require("../models/products_wallet.model");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "userId") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function getWalletProductsCount(req, res) {
    try {
        res.json(await walletOPerationsManagmentFunctions.getWalletProductsCount(getFiltersObject({ ...req.query, userId: req.data._id })));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllWalletProductsInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await walletOPerationsManagmentFunctions.getAllWalletProductsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject({ ...filters, userId: req.data._id })));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteWalletProduct(req, res) {
    try{
        res.json(await walletOPerationsManagmentFunctions.deleteWalletProduct(req.data._id, req.params.productId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    getWalletProductsCount,
    getAllWalletProductsInsideThePage,
    deleteWalletProduct
}