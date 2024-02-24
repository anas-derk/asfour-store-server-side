async function putChangeBussinessEmailPassword(req, res) {
    try{
        const   email = req.query.email,
                password = req.query.password,
                newPassword = req.query.newPassword;
        // Start Handle Email Value To Check It Before Save In DB
        const { isEmail } = require("../global/functions");
        // Check If Email And Password Are Exist
        if (email.length > 0 && password.length > 0 && newPassword.length > 0) {
            // Check If Email Valid
            if (isEmail(email)) {
                const { changeBussinessEmailPassword } = require("../models/global_password.model");
                const result = await changeBussinessEmailPassword(email.toLowerCase(), password, newPassword);
                await res.json(result);
            } else
                await res.status(400).json("Error, This Is Not Email Valid !!");
        } else
            await res.status(400).json("Error, Please Enter Email And Password And New Password Or Rest Input !!");
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

module.exports = {
    putChangeBussinessEmailPassword,
}