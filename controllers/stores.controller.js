const { getResponseObject, checkIsExistValueForFieldsAndDataTypes } = require("../global/functions");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "status") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "customerName") filtersObject[`billing_address.given_name`] = filters[objectKey];
        if (objectKey === "email") filtersObject[`billing_address.email`] = filters[objectKey];
        if (objectKey === "customerId") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function getAllStoresInsideThePage(req, res) {
    try{
        const filters = req.query;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(filters.pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(filters.pageSize), dataType: "number", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { getAllStoresInsideThePage } = require("../models/stores.model");
        await res.json(await getAllStoresInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getStoresCount(req, res) {
    try{
        const filters = req.query;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(filters.pageNumber), dataType: "number", isRequiredValue: false },
            { fieldName: "page Size", fieldValue: Number(filters.pageSize), dataType: "number", isRequiredValue: false },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { getStoresCount } = require("../models/stores.model");
        await res.json(await getStoresCount(getFiltersObject(filters)));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    getAllStoresInsideThePage,
    getStoresCount,
}