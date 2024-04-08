const { getResponseObject } = require("../global/functions");

const globalPasswordsManagmentFunctions = require("../models/global_passwords.model");

async function putChangeBussinessEmailPassword(req, res) {
    try{
        const emailAndPasswordAndNewPassword = req.query;
        const result = await globalPasswordsManagmentFunctions.changeBussinessEmailPassword(req.data._id, emailAndPasswordAndNewPassword.email.toLowerCase(), emailAndPasswordAndNewPassword.password, emailAndPasswordAndNewPassword.newPassword);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    putChangeBussinessEmailPassword,
}