const { getResponseObject, checkIsExistValueForFieldsAndDataTypes, isEmail } = require("../global/functions");

async function postAddNewReferal(req, res) {
    try{
        const referalDetails = req.body;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "name", fieldValue: referalDetails.name, dataType: "string", isRequiredValue: true },
            { fieldName: "email", fieldValue: referalDetails.email, dataType: "string", isRequiredValue: true },
            { fieldName: "referal", fieldValue: referalDetails.referal, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        if (isEmail(referalDetails.email)) {
            const { addNewReferal } = require("../models/referals.model");
            await res.json(await addNewReferal(referalDetails));
            return;
        }
        await res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
    }
    catch(err) {
        console.log(err);
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postAddNewReferal,
}