async function getAllOrdersInsideThePage(req, res) {
    try{
        const filters = req.query;
        for (let objectKey in filters) {
            if (
                objectKey !== "pageNumber" &&
                objectKey !== "pageSize" &&
                objectKey !== "orderNumber" &&
                objectKey !== "_id" &&
                objectKey !== "klarnaReference" &&
                objectKey !== "status" &&
                objectKey !== "customerName" &&
                objectKey !== "email"
            ) { await res.status(400).json("Invalid Request, Please Send Valid Keys !!"); return; }
        }
        const { getAllOrdersInsideThePage } = require("../models/orders.model");
        const result = await getAllOrdersInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters));
        await res.json(result);
    }
    catch(err) {
        console.log(err);
        await res.status(500).json(err);
    }
}

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "orderNumber") filtersObject[objectKey] = Number(filters[objectKey]);
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "klarnaReference") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "status") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "customerName") filtersObject[`billing_address.given_name`] = filters[objectKey];
        if (objectKey === "email") filtersObject[`billing_address.email`] = filters[objectKey];
    }
    return filtersObject;
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
                objectKey !== "klarnaReference" &&
                objectKey !== "status" &&
                objectKey !== "customerName" &&
                objectKey !== "email"
            ) { await res.status(400).json("Invalid Request, Please Send Valid Keys !!"); return; }
        }
        const { getOrdersCount } = require("../models/orders.model");
        await res.json(await getOrdersCount(getFiltersObject(filters)));
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function getOrderDetails(req, res) {
    try{
        const orderId = req.params.orderId;
        if (!orderId) await res.status(400).json("Please Send Order Id !!");
        else {
            const { getOrderDetails } = require("../models/orders.model");
            await res.json(await getOrderDetails(orderId));
        }
    }
    catch(err) {
        console.log(err);
        await res.status(500).json(err);
    }
}

async function postNewOrder(req, res) {
    try{
        const { postNewOrder } = require("../models/orders.model");
        const result = await postNewOrder(req.body);
        await res.json(result);
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function postNewUPaymentsPayment(req, res) {
    try{
        const { post } = require("axios");
        const response = await post("https://sandboxapi.upayments.com/api/v1/charge", req.body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.UPAYMENTS_TOKEN}`
            },
        });
        await res.json(await response.data);
    }
    catch(err) {
        console.log(err.response.data);
        await res.status(500).json(err);
    }
}

async function putOrder(req, res) {
    try{
        const orderId = req.params.orderId;
        const newOrderDetails = req.body;
        if (!orderId) await res.status(400).json("Please Send Order Id !!");
        else {
            const { updateOrder } = require("../models/orders.model");
            await updateOrder(orderId, newOrderDetails);
            await res.json("Updating Order Details Has Been Successfuly !!");
        }
    }
    catch(err){
        await res.status(500).json(err);
    }
}

async function putUPaymentsOrder(req, res) {
    try{
        const orderId = req.params.orderId;
        if (!orderId) await res.status(400).json("Please Send Order Id !!");
        else {
            const { updateUPaymentsOrder } = require("../models/orders.model");
            await updateUPaymentsOrder(orderId);
            await res.json("Updating Order Details Has Been Successfuly !!");
        }
    }
    catch(err){
        await res.status(500).json(err);
    }
}

async function putOrderProduct(req, res) {
    try{
        const   orderId = req.params.orderId,
                productId = req.params.productId;
        const newOrderProductDetails = req.body;
        if (!orderId || !productId) await res.status(400).json("Please Send Order Id And Product Id !!");
        else {
            const { updateOrderProduct } = require("../models/orders.model");
            const result = await updateOrderProduct(orderId, productId, newOrderProductDetails);
            await res.json(result);
        }
    }
    catch(err){
        await res.status(500).json(err);
    }
}

async function deleteOrder(req, res) {
    try{
        const orderId = req.params.orderId;
        if (!orderId) await res.status(400).json("Please Send Order Id !!");
        else {
            const { deleteOrder } = require("../models/orders.model");
            const result = await deleteOrder(orderId);
            await res.json(result);
        }
    }
    catch(err){
        await res.status(500).json(err);
    }
}

async function deleteProductFromOrder(req, res) {
    try{
        const   orderId = req.params.orderId,
                productId = req.params.productId;
        if (!orderId || !productId) await res.status(400).json("Please Send Order Id And Product Id !!");
        else {
            const { deleteProductFromOrder } = require("../models/orders.model");
            const result = await deleteProductFromOrder(orderId, productId);
            await res.json(result);
        }
    }
    catch(err){
        await res.status(500).json(err);
    }
}

module.exports = {
    getAllOrdersInsideThePage,
    getFiltersObject,
    getOrdersCount,
    getOrderDetails,
    postNewOrder,
    postNewUPaymentsPayment,
    putOrder,
    putUPaymentsOrder,
    putOrderProduct,
    deleteOrder,
    deleteProductFromOrder,
}