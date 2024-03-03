async function getAdminLogin(req, res) {
    try{
        const   email = req.query.email,
                password = req.query.password;
        // Start Handle Email Value To Check It Before Save In DB
        const { isEmail } = require("../global/functions");
        // Check If Email And Password Are Exist
        if (email.length > 0 && password.length > 0) {
            // Check If Email Valid
            if (isEmail(email)) {
                const { adminLogin } = require("../models/admin.model");
                const result = await adminLogin(email.toLowerCase(), password);
                await res.json(result);
            } else {
                // Return Error Msg If Email Is Not Valid
                await res.status(400).json({
                    msg: "Error, This Is Not Email Valid !!",
                    error: true,
                    data: {},
                });
            }
        } else {
            await res.status(400).json({
                msg: "Error, Please Enter Email And Password Or Rest Input !!",
                error: true,
                data: {},
            });
        }
    }
    catch(err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
    }
}

async function getAdminUserInfo(req, res) {
    try{
        const userId = req.params.userId;
        if (!userId) await res.status(400).json("Sorry, Please Send Admin User Id !!");
        else {
            const { getAdminUserInfo } = require("../models/admin.model");
            const result = await getAdminUserInfo(userId);
            await res.json(result);
        }
    }
    catch(err){
        await res.status(500).json(err);
    }
}

module.exports = {
    getAdminLogin,
    getAdminUserInfo,
}