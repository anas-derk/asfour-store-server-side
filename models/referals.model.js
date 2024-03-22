// Import Referal Model Object

const { referalModel } = require("../models/all.models");

async function addNewReferal(referalDetails) {
    try {
        const referal = await subscriptionModel.findOne({ email: referalDetails.email });
        if (referal) {
            return {
                msg: "Sorry, This Referal Is Already Exist !!",
                error: true,
                data: {},
            }
        }
        const newReferal = new referalModel(referalDetails);
        // Save The New User As Document In User Collection
        await newReferal.save();
        return {
            msg: "Ok !!, Create New Referal Process Has Been Successfuly !!",
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    addNewReferal,
}