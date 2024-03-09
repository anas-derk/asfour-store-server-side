const { getResponseObject, checkIsExistValueForFieldsAndDataTypes } = require("../global/functions");

async function putChangeBussinessEmailPassword(req, res) {
    try{
        const token = req.headers.authorization;
        const   email = req.query.email,
                password = req.query.password,
                newPassword = req.query.newPassword;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "JWT", fieldValue: token, dataType: "string", isRequiredValue: true },
            { fieldName: "Bussiness Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "Bussiness Password", fieldValue: password, dataType: "string", isRequiredValue: true },
            { fieldName: "New Bussiness Password", fieldValue: newPassword, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const { isEmail } = require("../global/functions");
        if (isEmail(email)) {
            const { changeBussinessEmailPassword } = require("../models/global_passwords.model");
            await res.json(await changeBussinessEmailPassword(email.toLowerCase(), password, newPassword));
            return;
        }
        await res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

module.exports = {
    putChangeBussinessEmailPassword,
}