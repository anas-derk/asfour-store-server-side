const { getResponseObject } = require("../global/functions");

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
        for (let objectKey in filters) {
            if (
                objectKey !== "pageNumber" &&
                objectKey !== "pageSize" &&
                objectKey !== "orderNumber" &&
                objectKey !== "_id" &&
                objectKey !== "status" &&
                objectKey !== "customerName" &&
                objectKey !== "email" &&
                objectKey !== "customerId"
            ) {
                await res.status(400).json(getResponseObject("Invalid Request, Please Send Valid Keys !!", true, {}));
                return;
            }
        }
        const { getAllOrdersInsideThePage } = require("../models/orders.model");
        await res.json(await getAllOrdersInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getOrdersCount(req, res) {
    try{
        const filters = req.query;
        for (let objectKey in filters) {
            if (
                objectKey !== "pageNumber" &&
                objectKey !== "pageSize" &&
                objectKey !== "orderNumber" &&
                objectKey !== "_id" &&
                objectKey !== "status" &&
                objectKey !== "customerName" &&
                objectKey !== "email" &&
                objectKey !== "customerId"
            ) {
                await res.status(400).json(getResponseObject("Invalid Request, Please Send Valid Keys !!", true, {}));
                return;
            }
        }
        const { getOrdersCount } = require("../models/orders.model");
        await res.json(await getOrdersCount(getFiltersObject(filters)));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getOrderDetails(req, res) {
    try{
        const orderId = req.params.orderId;
        if (!orderId) {
            await res.status(400).json(getResponseObject("Please Send Order Id !!", true, {}));
            return;
        }
        const { getOrderDetails } = require("../models/orders.model");
        await res.json(await getOrderDetails(orderId));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function postNewOrder(req, res) {
    try{
        const { postNewOrder } = require("../models/orders.model");
        await res.json(await postNewOrder(req.body));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putOrder(req, res) {
    try{
        const orderId = req.params.orderId;
        const newOrderDetails = req.body;
        if (!orderId) {
            await res.status(400).json(getResponseObject("Please Send Order Id !!", true, {}));
            return;
        }
        const { updateOrder } = require("../models/orders.model");
        await res.json(await updateOrder(orderId, newOrderDetails));
    }
    catch(err){
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putOrderProduct(req, res) {
    try{
        const   orderId = req.params.orderId,
                productId = req.params.productId;
        const newOrderProductDetails = req.body;
        if (!orderId || !productId) {
            await res.status(400).json(getResponseObject("Please Send Order Id And Product Id !!", true, {}));
            return;
        }
        const { updateOrderProduct } = require("../models/orders.model");
        await res.json(await updateOrderProduct(orderId, productId, newOrderProductDetails));
    }
    catch(err){
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function deleteOrder(req, res) {
    try{
        const orderId = req.params.orderId;
        if (!orderId) {
            await res.status(400).json(getResponseObject("Please Send Order Id !!", true, {}));
            return;
        }
        const { deleteOrder } = require("../models/orders.model");
        await res.json(await deleteOrder(orderId));
    }
    catch(err){
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function deleteProductFromOrder(req, res) {
    try{
        const   orderId = req.params.orderId,
                productId = req.params.productId;
        if (!orderId || !productId) {
            await res.status(400).json(getResponseObject("Please Send Order Id And Product Id !!", true, {}));
            return;
        }
        const { deleteProductFromOrder } = require("../models/orders.model");
        await res.json(await deleteProductFromOrder(orderId, productId));
    }
    catch(err){
        await res.status(500).json(getResponseObject(err.message, true, {}));
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