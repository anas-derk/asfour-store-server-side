// Import Subscription Model Object

const { subscriptionModel } = require("../models/all.models");

async function addNewSubscription(email) {
    try {
        const subscription = await subscriptionModel.findOne({ email });
        if (subscription) {
            return {
                msg: "Sorry, This Subscription Is Already Exist !!",
                error: true,
                data: {},
            }
        }
        const newSubscription = new subscriptionModel({
            email,
        });
        // Save The New User As Document In User Collection
        await newSubscription.save();
        return {
            msg: "Ok !!, Create New Subscription Process Has Been Successfuly !!",
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    addNewSubscription,
}