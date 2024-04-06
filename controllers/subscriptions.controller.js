const { getResponseObject, checkIsExistValueForFieldsAndDataTypes, isEmail } = require("../global/functions");

async function postAddNewSubscription(req, res) {
    try{
        const email = req.body.email;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "email", fieldValue: email, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        if (isEmail(email)) {
            const { addNewSubscription } = require("../models/subscriptions.model");
            res.json(await addNewSubscription(email));
            return;
        }
        res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postAddNewSubscription,
}