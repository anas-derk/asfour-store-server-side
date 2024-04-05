const { getResponseObject, checkIsExistValueForFieldsAndDataTypes } = require("../global/functions");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "name") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "status") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "ownerFirstName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "ownerLastName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "ownerEmail") filtersObject[`ownerEmail`] = filters[objectKey];
    }
    return filtersObject;
}

async function getAllStoresInsideThePage(req, res) {
    try{
        const filters = req.query;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(filters.pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(filters.pageSize), dataType: "number", isRequiredValue: true },
            { fieldName: "Store Id", fieldValue: filters._id, dataType: "ObjectId", isRequiredValue: false },
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
            { fieldName: "Store Id", fieldValue: filters._id, dataType: "ObjectId", isRequiredValue: false },
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

async function getStoreDetails(req, res) {
    try{
        const storeId = req.params.storeId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: storeId, dataType: "ObjectId", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { getStoreDetails } = require("../models/stores.model");
        await res.json(await getStoreDetails(storeId));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postNewStore(req, res) {
    try{
        const uploadError = req.uploadError;
        if (uploadError) {
            await res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        const { createNewStore } = require("../models/stores.model");
        await res.json(await createNewStore(Object.assign({}, { ...req.body, imagePath: req.file.path })));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postApproveStore(req, res) {
    try{
        const storeId = req.params.storeId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: storeId, dataType: "ObjectId", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { approveStore } = require("../models/stores.model");
        await res.json(await approveStore(req.data._id, storeId));
    }
    catch(err) {
        console.log(err);
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putStoreInfo(req, res) {
    try{
        const storeId = req.params.storeId;
        const newStoreDetails = req.body;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: storeId, dataType: "ObjectId", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { updateStoreInfo } = require("../models/stores.model");
        await res.json(await updateStoreInfo(req.data._id, storeId, newStoreDetails));
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteStore(req, res) {
    try{
        const storeId = req.params.storeId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: storeId, dataType: "ObjectId", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { deleteStore } = require("../models/stores.model");
        await res.json(await deleteStore(req.data._id, storeId));
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    getAllStoresInsideThePage,
    getStoresCount,
    getStoreDetails,
    postNewStore,
    postApproveStore,
    putStoreInfo,
    deleteStore,
}