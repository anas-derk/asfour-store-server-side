const { getResponseObject } = require("../global/functions");

const ordersManagmentFunctions = require("../models/orders.model");

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
        await res.json(await ordersManagmentFunctions.getAllOrdersInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getOrdersCount(req, res) {
    try{
        await res.json(await ordersManagmentFunctions.getOrdersCount(getFiltersObject(filters)));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getOrderDetails(req, res) {
    try{
        await res.json(await ordersManagmentFunctions.getOrderDetails(req.params.orderId));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postNewOrder(req, res) {
    try{
        await res.json(await ordersManagmentFunctions.postNewOrder(req.body));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putOrder(req, res) {
    try{
        await res.json(await ordersManagmentFunctions.updateOrder(req.params.orderId, req.body));
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putOrderProduct(req, res) {
    try{
        await res.json(await ordersManagmentFunctions.updateOrderProduct(req.params.orderId, req.params.productId, newOrderProductDetails));
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteOrder(req, res) {
    try{
        await res.json(await ordersManagmentFunctions.deleteOrder(req.params.orderId));
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteProductFromOrder(req, res) {
    try{
        await res.json(await deleteProductFromOrder(req.params.orderId, req.params.productId));
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