const { getResponseObject } = require("../global/functions");

async function getAdminLogin(req, res) {
    try{
        const   email = req.query.email,
                password = req.query.password;
        const { isEmail } = require("../global/functions");
        if (!email) {
            await res.status(400).json(getResponseObject("Please Send The Email !!", true, {}));
            return;
        }
        if (!password) {
            await res.status(400).json(getResponseObject("Please Send The Password !!", true, {}));
            return;
        }
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
        await res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getAdminUserInfo(req, res) {
    try{
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json(getResponseObject("Sorry, Please Send JWT For User !!", true, {}));
            return;
        }
        const { verify } = require("jsonwebtoken");
        const data = verify(token, process.env.secretKey);
        const { getAdminUserInfo } = require("../models/admin.model");
        await res.json(await getAdminUserInfo(data._id));
    }
    catch(err){
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

module.exports = {
    getAdminLogin,
    getAdminUserInfo,
}