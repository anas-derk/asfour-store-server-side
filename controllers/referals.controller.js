const { getResponseObject } = require("../global/functions");

const referalsManagmentFunctions = require("../models/referals.model");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "productId") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "customerName") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function postAddNewReferal(req, res) {
    try{
        res.json(await referalsManagmentFunctions.addNewReferal(req.body));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getProductReferalsCount(req, res) {
    try {
        const productId = req.params.productId;
        res.json(await referalsManagmentFunctions.getProductReferalsCount(getFiltersObject({ ...req.query, productId})));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllProductReferalsInsideThePage(req, res) {
    try {
        const productId = req.params.productId;
        const filters = req.query;
        res.json(await referalsManagmentFunctions.getAllProductReferalsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject({...filters, productId})));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postAddNewReferal,
    getProductReferalsCount,
    getAllProductReferalsInsideThePage,
}