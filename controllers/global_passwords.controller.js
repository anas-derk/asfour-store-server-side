const { getResponseObject, checkIsExistValueForFieldsAndDataTypes } = require("../global/functions");

async function putChangeBussinessEmailPassword(req, res) {
    try{
        const   email = req.query.email,
                password = req.query.password,
                newPassword = req.query.newPassword;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Bussiness Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "Bussiness Password", fieldValue: password, dataType: "string", isRequiredValue: true },
            { fieldName: "New Bussiness Password", fieldValue: newPassword, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { isEmail } = require("../global/functions");
        if (isEmail(email)) {
            const { changeBussinessEmailPassword } = require("../models/global_passwords.model");
            res.json(await changeBussinessEmailPassword(email.toLowerCase(), password, newPassword));
            return;
        }
        res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    putChangeBussinessEmailPassword,
}