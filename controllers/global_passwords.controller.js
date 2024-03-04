async function putChangeBussinessEmailPassword(req, res) {
    try{
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json({
                msg: "Sorry, Please Send JWT For User !!",
                error: true,
                data: {},
            });
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const   email = req.query.email,
                password = req.query.password,
                newPassword = req.query.newPassword;
        // Start Handle Email Value To Check It Before Save In DB
        const { isEmail } = require("../global/functions");
        // Check If Email And Password Are Exist
        if (email.length > 0 && password.length > 0 && newPassword.length > 0) {
            // Check If Email Valid
            if (isEmail(email)) {
                const { changeBussinessEmailPassword } = require("../models/global_passwords.model");
                const result = await changeBussinessEmailPassword(email.toLowerCase(), password, newPassword);
                await res.json(result);
                return;
            }
            await res.status(400).json({
                msg: "Error, This Is Not Email Valid !!",
                error: true,
                data: {},
            });
            return;
        }
        await res.status(400).json({
            msg: "Error, Please Enter Email And Password And New Password Or Rest Input !!",
            error: true,
            data: {},
        });
    }
    catch(err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
    }
}

module.exports = {
    putChangeBussinessEmailPassword,
}