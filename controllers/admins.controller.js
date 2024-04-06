const { getResponseObject, checkIsExistValueForFieldsAndDataTypes, isEmail } = require("../global/functions");

async function getAdminLogin(req, res) {
    try{
        const   email = req.query.email,
                password = req.query.password;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "password", fieldValue: password, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        if (isEmail(email)) {
            const { adminLogin } = require("../models/admins.model");
            const result = await adminLogin(email.toLowerCase(), password);
            if (!result.error) {
                const { sign } = require("jsonwebtoken");
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
            return;
        }
        res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAdminUserInfo(req, res) {
    try{
        const { getAdminUserInfo } = require("../models/admins.model");
        res.json(await getAdminUserInfo(req.data._id));
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    getAdminLogin,
    getAdminUserInfo,
}