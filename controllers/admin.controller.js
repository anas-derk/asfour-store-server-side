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
            await res.status(400).json(checkResult);
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
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "JWT", fieldValue: token, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
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