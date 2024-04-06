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
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
            { fieldName: "page Number", fieldValue: filters.pageNumber, dataType: "string", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: filters.pageSize, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { getAllProductReferalsInsideThePage } = require("../models/referals.model");
        res.json(await getAllProductReferalsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject({...filters, productId})));
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