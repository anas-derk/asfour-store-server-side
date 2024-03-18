const { getResponseObject, checkIsExistValueForFieldsAndDataTypes } = require("../global/functions");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "orderNumber") filtersObject[objectKey] = Number(filters[objectKey]);
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "status") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "customerName") filtersObject[`billing_address.given_name`] = filters[objectKey];
        if (objectKey === "email") filtersObject[`billing_address.email`] = filters[objectKey];
        if (objectKey === "customerId") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function getAllOrdersInsideThePage(req, res) {
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
        const { getAllOrdersInsideThePage } = require("../models/orders.model");
        await res.json(await getAllOrdersInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getOrdersCount(req, res) {
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
        const { getOrdersCount } = require("../models/orders.model");
        await res.json(await getOrdersCount(getFiltersObject(filters)));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getOrderDetails(req, res) {
    try{
        const orderId = req.params.orderId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: orderId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { getOrderDetails } = require("../models/orders.model");
        await res.json(await getOrderDetails(orderId));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postNewOrder(req, res) {
    try{
        const { postNewOrder } = require("../models/orders.model");
        await res.json(await postNewOrder(req.body));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putOrder(req, res) {
    try{
        const orderId = req.params.orderId;
        const newOrderDetails = req.body;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: orderId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { updateOrder } = require("../models/orders.model");
        await res.json(await updateOrder(orderId, newOrderDetails));
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putOrderProduct(req, res) {
    try{
        const   orderId = req.params.orderId,
                productId = req.params.productId;
        const newOrderProductDetails = req.body;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: orderId, dataType: "string", isRequiredValue: true },
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { updateOrderProduct } = require("../models/orders.model");
        await res.json(await updateOrderProduct(orderId, productId, newOrderProductDetails));
    }
    catch(err){
        console.log(err);
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteOrder(req, res) {
    try{
        const orderId = req.params.orderId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: orderId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { deleteOrder } = require("../models/orders.model");
        await res.json(await deleteOrder(orderId));
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteProductFromOrder(req, res) {
    try{
        const   orderId = req.params.orderId,
                productId = req.params.productId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: orderId, dataType: "string", isRequiredValue: true },
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { deleteProductFromOrder } = require("../models/orders.model");
        await res.json(await deleteProductFromOrder(orderId, productId));
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    getAllOrdersInsideThePage,
    getFiltersObject,
    getOrdersCount,
    getOrderDetails,
    postNewOrder,
    putOrder,
    putOrderProduct,
    deleteOrder,
    deleteProductFromOrder,
}