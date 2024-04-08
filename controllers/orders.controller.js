const { getResponseObject } = require("../global/functions");

const ordersManagmentFunctions = require("../models/orders.model");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "storeId") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "orderNumber") filtersObject[objectKey] = Number(filters[objectKey]);
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "status") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "customerName") filtersObject[`billing_address.given_name`] = filters[objectKey];
        if (objectKey === "email") filtersObject[`billing_address.email`] = filters[objectKey];
        if (objectKey === "customerId") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "isDeleted") {
            if (filters[objectKey] === "yes") {
                filtersObject[objectKey] = true;
            }
            else filtersObject[objectKey] = false;
        }
    }
    return filtersObject;
}

async function getOrdersCount(req, res) {
    try{
        res.json(await ordersManagmentFunctions.getOrdersCount(getFiltersObject(req.query)));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllOrdersInsideThePage(req, res) {
    try{
        const filters = req.query;
        res.json(await ordersManagmentFunctions.getAllOrdersInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getOrderDetails(req, res) {
    try{
        res.json(await ordersManagmentFunctions.getOrderDetails(req.params.orderId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postNewOrder(req, res) {
    try{
        res.json(await ordersManagmentFunctions.createNewOrder(req.body));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putOrder(req, res) {
    try{
        res.json(await ordersManagmentFunctions.updateOrder(req.params.orderId, req.body));
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putOrderProduct(req, res) {
    try{
        res.json(await ordersManagmentFunctions.updateOrderProduct(req.params.orderId, req.params.productId, req.body));
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteOrder(req, res) {
    try{
        res.json(await ordersManagmentFunctions.deleteOrder(req.params.orderId));
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteProductFromOrder(req, res) {
    try{
        res.json(await ordersManagmentFunctions.deleteProductFromOrder(req.params.orderId, req.params.productId));
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
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