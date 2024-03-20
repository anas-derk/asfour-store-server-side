const { getResponseObject, checkIsExistValueForFieldsAndDataTypes, isEmail } = require("../global/functions");

async function postAddNewSubscription(req, res) {
    try{
        const email = req.body.email;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "email", fieldValue: email, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        if (isEmail(email)) {
            const { addNewSubscription } = require("../models/subscriptions.model");
            await res.json(await addNewSubscription(email));
            return;
        }
        await res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postAddNewSubscription,
}