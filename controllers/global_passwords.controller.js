const { getResponseObject } = require("../global/functions");

const globalPasswordsManagmentFunctions = require("../models/global_passwords.model");

async function putChangeBussinessEmailPassword(req, res) {
    try{
        const emailAndPasswordAndNewPassword = req.query;
        res.json(await globalPasswordsManagmentFunctions.changeBussinessEmailPassword(emailAndPasswordAndNewPassword.email.toLowerCase(), emailAndPasswordAndNewPassword.password, emailAndPasswordAndNewPassword.newPassword));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    putChangeBussinessEmailPassword,
}