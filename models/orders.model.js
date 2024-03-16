// Import  Order Model Object

const { orderModel, userModel } = require("../models/all.models");

async function getAllOrdersInsideThePage(pageNumber, pageSize, filters) {
    try {
        return {
            msg: `Get All Orders Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await orderModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ orderNumber: -1 }),
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getOrdersCount(filters) {
    try {
        return {
            msg: "Get Orders Count Process Has Been Successfully !!",
            error: false,
            data: await orderModel.countDocuments(filters),
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getOrderDetails(orderId) {
    try {
        const order = await orderModel.findById(orderId);
        if (order) {
            return {
                msg: `Get Details For Order: ${orderId} Process Has Been Successfully !!`,
                error: false,
                data: order,
            }
        }
        return {
            msg: "Sorry, This Order Is Not Found !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function postNewOrder(orderDetails) {
    try {
        const ordersCount = await orderModel.countDocuments();
        const newOrder = new orderModel({ ...orderDetails, orderNumber: ordersCount + 1 });
        const { _id, orderNumber } = await newOrder.save();
        if (orderDetails.customerId) {
            const user = await userModel.findOne({ _id: orderDetails.customerId });
            if (user) {
                for (let i = 0; i < orderDetails.order_products.length; i++) {
                    const wallet_productIndex = user.wallet_products_list.findIndex((wallet_product) => wallet_product.productId == orderDetails.order_products[i].productId);
                    if (wallet_productIndex == -1) {
                        user.wallet_products_list.push({
                            productId: orderDetails.order_products[i].productId,
                            name: orderDetails.order_products[i].name,
                            price: orderDetails.order_products[i].unit_price,
                            discount: orderDetails.order_products[i].discount,
                            imagePath: orderDetails.order_products[i].image_path,
                        });
                    }
                }
                await userModel.updateOne({ _id: orderDetails.customerId } , { wallet_products_list: user.wallet_products_list });
            }
        }
        return {
            msg: "Creating New Order Has Been Successfuly !!",
            error: false,
            data: {
                orderId: _id,
                orderNumber: orderNumber
            },
        }
    } catch (err) {
        throw Error(err);
    }
}

async function updateOrder(orderId, newOrderDetails) {
    try {
        const order = await orderModel.findById(orderId);
        if (order) {
            await orderModel.updateOne({ _id: orderId }, { ...newOrderDetails });
            return {
                msg: `Update Details For Order That : ( Id: ${ orderId }) Process Has Been Successfully !!`,
                error: false,
                data: {},
            };
        }
        return {
            msg: "Sorry, This Order Is Not Found !!",
            error: true,
            data: {},
        };
    } catch (err) {
        throw Error(err);
    }
}

async function updateOrderProduct(orderId, productId, newOrderProductDetails) {
    try {
        const order = await orderModel.findOne({ _id: orderId });
        if (order) {
            const productIndex = order.order_products.findIndex((order_product) => order_product._id == productId);
            if (productIndex >= 0) {
                order.order_products[productIndex].quantity = newOrderProductDetails.quantity;
                order.order_products[productIndex].name = newOrderProductDetails.name;
                order.order_products[productIndex].unit_price = newOrderProductDetails.unit_price;
                order.order_products[productIndex].total_amount = newOrderProductDetails.total_amount;
                const { calcOrderAmount } = require("../global/functions");
                await orderModel.updateOne({ _id: orderId }, { order_products, order_amount: calcOrderAmount(order.order_products) });
                return {
                    msg: "Updating Order Details Process Has Been Successfuly !!",
                    error: false,
                    data: {},
                }
            }
            return {
                msg: `Sorry, This Product For Order Id: ${orderId} Is Not Found !!`,
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Order Is Not Found !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function deleteOrder(orderId){
    try{
        const order = await orderModel.updateOne({ _id: orderId }, { isDeleted: true });
        if (order) {
            return {
                msg: "Deleting This Order Has Been Successfuly !!",
                error: false,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Order Is Not Found !!",
            error: true,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

async function deleteProductFromOrder(orderId, productId) {
    try {
        const order = await orderModel.findOne({ _id: orderId });
        if (order) {
            const newOrderLines = order.order_lines.filter((order_line) => order_line._id == productId);
            if (newOrderLines.length < order.order_lines) {
                await orderModel.updateOne({ _id: orderId }, { order_lines: newOrderLines });
                return {
                    msg: "Deleting Product From Order Has Been Successfuly !!",
                    error: false,
                    data: {},
                }
            }
            return {
                msg: `Sorry, This Product For Order Id: ${orderId} Is Not Found !!`,
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Order Is Not Found !!",
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

module.exports = {
    getAllOrdersInsideThePage,
    getOrdersCount,
    getOrderDetails,
    postNewOrder,
    updateOrder,
    updateOrderProduct,
    deleteOrder,
    deleteProductFromOrder,
}