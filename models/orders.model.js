// Import Mongoose And Order Model Object

const { mongoose, orderModel } = require("../models/all.models");

async function getAllOrdersInsideThePage(pageNumber, pageSize, filters) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const orders = await orderModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize);
        await mongoose.disconnect();
        return orders;
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getOrdersCount(filters) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const ordersCount = await orderModel.countDocuments(filters);
        await mongoose.disconnect();
        return ordersCount;
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getOrderDetails(orderId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const order = await orderModel.findById(orderId);
        await mongoose.disconnect();
        return order;
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function postNewOrder(orderDetails) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const ordersCount = await orderModel.countDocuments();
        const newOrder = new orderModel({ ...orderDetails, orderNumber: ordersCount + 1 });
        const { _id, orderNumber } = await newOrder.save();
        await mongoose.disconnect();
        return { msg: "Creating New Order Has Been Successfuly !!", orderId: _id, orderNumber: orderNumber };
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function updateOrder(orderId, newOrderDetails) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const { orderNumber } = await orderModel.findOneAndUpdate({
            _id: orderId,
        }, { ...newOrderDetails });
        await mongoose.disconnect();
        return orderNumber;
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function updateUPaymentsOrder(orderId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        await orderModel.updateOne({
            _id: orderId,
        }, { checkout_status: "checkout_successful" });
        await mongoose.disconnect();
        return orderNumber;
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    getAllOrdersInsideThePage,
    getOrdersCount,
    getOrderDetails,
    postNewOrder,
    updateOrder,
    updateUPaymentsOrder,
}