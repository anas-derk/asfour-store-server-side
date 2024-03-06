const { getResponseObject } = require("../global/functions");

async function putChangeBussinessEmailPassword(req, res) {
    try{
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json(getResponseObject("Sorry, Please Send JWT For User !!", true, {}));
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const   email = req.query.email,
                password = req.query.password,
                newPassword = req.query.newPassword;
        const { isEmail } = require("../global/functions");
        if (!email) {
            await res.status(400).json(getResponseObject("Please Send The Email !!", true, {}));
            return;
        }
        if (!password) {
            await res.status(400).json(getResponseObject("Please Send The Password !!", true, {}));
            return;
        }
        if (!newPassword) {
            await res.status(400).json(getResponseObject("Please Send The New Password !!", true, {}));
            return;
        }
        if (isEmail(email)) {
            const { changeBussinessEmailPassword } = require("../models/global_passwords.model");
            const result = await changeBussinessEmailPassword(email.toLowerCase(), password, newPassword);
            await res.json(result);
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