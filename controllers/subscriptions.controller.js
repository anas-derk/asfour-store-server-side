const { getResponseObject } = require("../global/functions");

const subscriptionsManagmentFunctions = require("../models/subscriptions.model");

async function postAddNewSubscription(req, res) {
    try{
        res.json(await subscriptionsManagmentFunctions.addNewSubscription(req.body.email));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postAddNewSubscription,
}