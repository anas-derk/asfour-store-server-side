const { getResponseObject } = require("../global/functions");

const adminsOPerationsManagmentFunctions = require("../models/admins.model");

const { sign } = require("jsonwebtoken");

async function getAdminLogin(req, res) {
    try{
        const emailAndPassword = req.query;
        const result = await adminsOPerationsManagmentFunctions.adminLogin(emailAndPassword.email.toLowerCase(), emailAndPassword.password);
        if (!result.error) {
            res.json({
                ...result,
                data: {
                    token: sign(result.data, process.env.secretKey, {
                        expiresIn: "1h",
                    }),
                }
            });
            return;
        }
        res.json(result);
    }
    catch(err) {
        console.log(err);
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAdminUserInfo(req, res) {
    try{
        res.json(await adminsOPerationsManagmentFunctions.getAdminUserInfo(req.data._id));
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    getAdminLogin,
    getAdminUserInfo,
}