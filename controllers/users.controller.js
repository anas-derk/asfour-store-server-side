const { getResponseObject, checkIsExistValueForFieldsAndDataTypes, isEmail } = require("../global/functions");

async function createNewUser(req, res) {
    try {
        const email = req.body.email,
            password = req.body.password;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "Password", fieldValue: password, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        if (isEmail(email)) {
            const { createNewUser } = require("../models/users.model");
            await res.json(await createNewUser(email.toLowerCase(), password));
            return;
        }
        await res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postNewFavoriteProduct(req, res) {
    try{
        const productId = req.query.productId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { addNewFavoriteProduct } = require("../models/users.model");
        await res.json(await addNewFavoriteProduct(req.data._id, productId));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postAccountVerificationCode(req, res) {
    try{
        const userEmail = req.query.email;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "User Email", fieldValue: userEmail, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { isEmail } = require("../global/functions");
        if (!isEmail(userEmail)) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Valid Email !!", true, {}));
            return;
        }
        const { isExistUserAndVerificationEmail } = require("../models/users.model");
        const result = await isExistUserAndVerificationEmail(userEmail);
        if (result.error) {
            await res.json(result);
            return;
        }
        const { sendCodeToUserEmail } = require("../global/functions");
        await res.json({
            msg: "Sending Verification Code Process Has Been Successfully !!",
            error: false,
            data: {
                code: await sendCodeToUserEmail(userEmail)
            }
        });
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function login(req, res) {
    try{
        const   email = req.query.email,
                password = req.query.password;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "Password", fieldValue: password, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        if (isEmail(email)) {
            const { login } = require("../models/users.model");
            const result = await login(email.toLowerCase(), password);
            if (!result.error) {
                const { sign } = require("jsonwebtoken");
                const token = sign(result.data, process.env.secretKey, {
                    expiresIn: "1h",
                });
                await res.json({
                    msg: result.msg,
                    error: result.error,
                    data: {
                        ...result.data,
                        token,
                    },
                });
                return;
            }
            await res.json(result);
            return;
        }
        await res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function loginWithGoogle(req, res) {
    try{
        const   email = req.query.email,
                first_name = req.query.first_name,
                last_name = req.query.last_name,
                preview_name = req.query.preview_name;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "First Name", fieldValue: first_name, dataType: "string", isRequiredValue: true },
            { fieldName: "Last Name", fieldValue: last_name, dataType: "string", isRequiredValue: true },
            { fieldName: "Preview Name", fieldValue: preview_name, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        if (isEmail(email)) {
            const { loginWithGoogle } = require("../models/users.model");
            const result = await loginWithGoogle(req.query);
            const { sign } = require("jsonwebtoken");
            const token = sign(result.data, process.env.secretKey, {
                expiresIn: "1h",
            });
            await res.json({
                msg: result.msg,
                error: result.error,
                data: {
                    ...result.data,
                    token,
                },
            });
            return;
        }
        await res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
    }
    catch(err) {
        console.log(err)
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getUserInfo(req, res) {
    try{
        const { getUserInfo } = require("../models/users.model");
        await res.json(await getUserInfo(req.data._id));
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllUsers(req, res) {
    try{
        const { getAllUsers } = require("../models/users.model");
        await res.json(await getAllUsers());
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getForgetPassword(req, res) {
    try{
        const email = req.query.email;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        if (isEmail(email)) {
            const { isUserAccountExist } = require("../models/users.model");
            const result = await isUserAccountExist(email);
            if (!result.error) {
                const { sendCodeToUserEmail } = require("../global/functions");
                await res.json({
                    ...result,
                    data: {
                        ...result.data,
                        code: await sendCodeToUserEmail(email),
                    },
                });
                return;
            }
            await res.json(getResponseObject("Sorry, This Email Is Not Exist !!", true, {}));
            return;
        }
        await res.status(400).json(getResponseObject("Sorry, Please Send Email !!", true, {}));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "customerId") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function getFavoriteProductsCount(req, res) {
    try {
        const filters = req.query;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Customer Id", fieldValue: filters.customerId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { getFavoriteProductsCount } = require("../models/users.model");
        await res.json(await getFavoriteProductsCount(getFiltersObject(filters)));
    }
    catch (err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getWalletProductsCount(req, res) {
    try {
        const filters = req.query;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Customer Id", fieldValue: filters.customerId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { getWalletProductsCount } = require("../models/users.model");
        await res.json(await getWalletProductsCount(getFiltersObject(filters)));
    }
    catch (err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllFavoriteProductsInsideThePage(req, res) {
    try{
        const filters = req.query;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: filters.pageNumber, dataType: "string", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: filters.pageSize, dataType: "string", isRequiredValue: true },
            { fieldName: "Customer Id", fieldValue: filters.customerId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { getAllFavoriteProductsInsideThePage } = require("../models/users.model");
        await res.json(await getAllFavoriteProductsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllWalletProductsInsideThePage(req, res) {
    try{
        const filters = req.query;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: filters.pageNumber, dataType: "string", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: filters.pageSize, dataType: "string", isRequiredValue: true },
            { fieldName: "Customer Id", fieldValue: filters.customerId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { getAllWalletProductsInsideThePage } = require("../models/users.model");
        await res.json(await getAllWalletProductsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch(err){
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putUserInfo(req, res) {
    try{
        const newUserData = req.body;
        const { updateUserInfo } = require("../models/users.model");
        await res.json(await updateUserInfo(req.data._id, newUserData));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putVerificationStatus(req, res) {
    try{
        const email = req.query.email;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        if (isEmail(email)) {
            const { updateVerificationStatus } = require("../models/users.model");
            const result = await updateVerificationStatus(email);
            if (!result.error) {
                const { sign } = require("jsonwebtoken");
                const token = sign(result.data, process.env.secretKey, {
                    expiresIn: "1h",
                });
                await res.json({
                    msg: result.msg,
                    error: result.error,
                    data: {
                        ...result.data,
                        token,
                    },
                });
                return;
            }
            await res.json(result);
            return;
        }
        await res.status(400).json(getResponseObject("Sorry, Inavalid Email !!", true, {}));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putResetPassword(req, res) {
    try{
        const userId = req.params.userId;
        const newPassword = req.query.newPassword;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Customer Id", fieldValue: userId, dataType: "string", isRequiredValue: true },
            { fieldName: "New Password", fieldValue: newPassword, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { resetUserPassword } = require("../models/users.model");
        await res.json(await resetUserPassword(userId, newPassword));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteProductFromFavoriteUserProducts(req, res) {
    try{
        const productId = req.query.productId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { deleteProductFromFavoriteUserProducts } = require("../models/users.model");
        await res.json(await deleteProductFromFavoriteUserProducts(req.data._id, productId));
    }
    catch(err) {
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteProductFromUserProductsWallet(req, res) {
    try{
        const productId = req.query.productId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { deleteProductFromUserProductsWallet } = require("../models/users.model");
        await res.json(await deleteProductFromUserProductsWallet(req.data._id, productId));
    }
    catch(err) {
        console.log(err);
        await res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    createNewUser,
    postNewFavoriteProduct,
    postAccountVerificationCode,
    login,
    loginWithGoogle,
    getUserInfo,
    getAllUsers,
    getFavoriteProductsCount,
    getWalletProductsCount,
    getAllFavoriteProductsInsideThePage,
    getAllWalletProductsInsideThePage,
    getForgetPassword,
    putUserInfo,
    putVerificationStatus,
    putResetPassword,
    deleteProductFromFavoriteUserProducts,
    deleteProductFromUserProductsWallet,
}