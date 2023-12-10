async function postNewOrder(req, res) {
    try{
        const { postNewOrder } = require("../models/orders.model");
        const result = await postNewOrder();
        await res.json(result);
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function postNewPayment(req, res) {
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
        console.log(err);
        await res.status(500).json(err);
    }
}

async function putOrder(req, res) {
    try{
        const orderId = req.params.orderId;
        console.log(orderId);
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

module.exports = {
    postNewOrder,
    postNewPayment,
    putOrder,
}