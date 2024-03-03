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
                if (!result.error) {
                    const { sign } = require("jsonwebtoken");
                    await res.json({
                        ...result,
                        data: {
                            ...result.data,
                            token: sign(result.data, process.env.secretKey, {
                                expiresIn: "1h",
                            }),
                        }
                    });
                    return;
                }
                await res.json(result);
                return;
            }
            // Return Error Msg If Email Is Not Valid
            await res.status(400).json({
                msg: "Error, This Is Not Email Valid !!",
                error: true,
                data: {},
            });
            return;
        }
        await res.status(400).json({
            msg: "Error, Please Enter Email And Password Or Rest Input !!",
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

async function getAdminUserInfo(req, res) {
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
        const data = verify(token, process.env.secretKey);
        const { getAdminUserInfo } = require("../models/admin.model");
        await res.json(await getAdminUserInfo(data._id));
    }
    catch(err){
        console.log(err);
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
    }
}

module.exports = {
    getAdminLogin,
    getAdminUserInfo,
}