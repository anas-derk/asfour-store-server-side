const { getResponseObject, checkIsExistValueForFieldsAndDataTypes, isEmail } = require("../global/functions");

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
        const referalDetails = req.body;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: referalDetails.productId, dataType: "string", isRequiredValue: true },
            { fieldName: "name", fieldValue: referalDetails.name, dataType: "string", isRequiredValue: true },
            { fieldName: "email", fieldValue: referalDetails.email, dataType: "string", isRequiredValue: true },
            { fieldName: "Referal Content", fieldValue: referalDetails.content, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        if (isEmail(referalDetails.email)) {
            const { addNewReferal } = require("../models/referals.model");
            res.json(await addNewReferal(referalDetails));
            return;
        }
        res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getProductReferalsCount(req, res) {
    try {
        const productId = req.params.productId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const filters = req.query;
        const { getProductReferalsCount } = require("../models/referals.model");
        res.json(await getProductReferalsCount(getFiltersObject({ ...filters, productId})));
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