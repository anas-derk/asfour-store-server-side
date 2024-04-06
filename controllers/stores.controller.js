const { getResponseObject, checkIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const { unlinkSync } = require("fs");

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
            res.status(400).json(checkResult);
            return;
        }
        const { getAllStoresInsideThePage } = require("../models/stores.model");
        res.json(await getAllStoresInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
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
            res.status(400).json(checkResult);
            return;
        }
        const { getStoresCount } = require("../models/stores.model");
        res.json(await getStoresCount(getFiltersObject(filters)));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getStoreDetails(req, res) {
    try{
        const storeId = req.params.storeId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: storeId, dataType: "ObjectId", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { getStoreDetails } = require("../models/stores.model");
        res.json(await getStoreDetails(storeId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postNewStore(req, res) {
    try{
        const uploadError = req.uploadError;
        if (uploadError) {
            res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        const { createNewStore } = require("../models/stores.model");
        const result = await createNewStore(Object.assign({}, { ...req.body, imagePath: req.file.path }));
        res.json(result);
        if (result.error) {
            unlinkSync(req.file.path);
        }
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postApproveStore(req, res) {
    try{
        const storeId = req.params.storeId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: storeId, dataType: "ObjectId", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { approveStore } = require("../models/stores.model");
        const result = await approveStore(req.data._id, storeId);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
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
            res.status(400).json(checkResult);
            return;
        }
        const { updateStoreInfo } = require("../models/stores.model");
        const result = await updateStoreInfo(req.data._id, storeId, newStoreDetails);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteStore(req, res) {
    try{
        const storeId = req.params.storeId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: storeId, dataType: "ObjectId", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { deleteStore } = require("../models/stores.model");
        const result = await deleteStore(req.data._id, storeId);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        else {
            unlinkSync(result.data.storeImagePath);
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteRejectStore(req, res) {
    try{
        const storeId = req.params.storeId;
        const rejectReason = req.query.rejectReason;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: storeId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "Reject Reason", fieldValue: rejectReason, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { rejectStore } = require("../models/stores.model");
        const result = await rejectStore(req.data._id, storeId);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        else {
            unlinkSync(result.data.storeImagePath);
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
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
    deleteRejectStore,
}