const { getResponseObject, sendCodeToUserEmail } = require("../global/functions");

const usersOPerationsManagmentFunctions = require("../models/users.model");

const { sign } = require("jsonwebtoken");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "customerId") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function login(req, res) {
    try{
        const   email = req.query.email,
                password = req.query.password;
        const result = await usersOPerationsManagmentFunctions.login(email.toLowerCase(), password);
        if (!result.error) {
            const token = sign(result.data, process.env.secretKey, {
                expiresIn: "1h",
            });
            res.json({
                msg: result.msg,
                error: result.error,
                data: {
                    ...result.data,
                    token,
                },
            });
            return;
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function loginWithGoogle(req, res) {
    try{
        const result = await usersOPerationsManagmentFunctions.loginWithGoogle(req.query);
        const token = sign(result.data, process.env.secretKey, {
            expiresIn: "1h",
        });
        res.json({
            msg: result.msg,
            error: result.error,
            data: {
                ...result.data,
                token,
            },
        });
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getUserInfo(req, res) {
    try{
        res.json(await usersOPerationsManagmentFunctions.getUserInfo(req.data._id));
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllUsers(req, res) {
    try{
        res.json(await usersOPerationsManagmentFunctions.getAllUsers());
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getFavoriteProductsCount(req, res) {
    try {
        res.json(await usersOPerationsManagmentFunctions.getFavoriteProductsCount(getFiltersObject(req.query)));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getWalletProductsCount(req, res) {
    try {
        res.json(await usersOPerationsManagmentFunctions.getWalletProductsCount(getFiltersObject(req.query)));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllFavoriteProductsInsideThePage(req, res) {
    try{
        const filters = req.query;
        res.json(await usersOPerationsManagmentFunctions.getAllFavoriteProductsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllWalletProductsInsideThePage(req, res) {
    try{
        const filters = req.query;
        res.json(await usersOPerationsManagmentFunctions.getAllWalletProductsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getForgetPassword(req, res) {
    try{
        const email = req.query.email;
        const result = await usersOPerationsManagmentFunctions.isUserAccountExist(email);
        if (!result.error) {
            res.json({
                ...result,
                data: {
                    ...result.data,
                    code: await sendCodeToUserEmail(email),
                },
            });
            return;
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function createNewUser(req, res) {
    try {
        const email = req.body.email,
            password = req.body.password;
        res.json(await usersOPerationsManagmentFunctions.createNewUser(email.toLowerCase(), password));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postNewFavoriteProduct(req, res) {
    try{
        const productId = req.query.productId;
        res.json(await usersOPerationsManagmentFunctions.addNewFavoriteProduct(req.data._id, productId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postAccountVerificationCode(req, res) {
    try{
        const userEmail = req.query.email;
        const result = await usersOPerationsManagmentFunctions.isExistUserAndVerificationEmail(userEmail);
        if (result.error) {
            res.json(result);
            return;
        }
        res.json({
            msg: "Sending Verification Code Process Has Been Successfully !!",
            error: false,
            data: {
                code: await sendCodeToUserEmail(userEmail)
            }
        });
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putUserInfo(req, res) {
    try{
        res.json(await usersOPerationsManagmentFunctions.updateUserInfo(req.data._id, req.body));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putVerificationStatus(req, res) {
    try{
        const result = await usersOPerationsManagmentFunctions.updateVerificationStatus(req.query.email);
        if (!result.error) {
            const token = sign(result.data, process.env.secretKey, {
                expiresIn: "1h",
            });
            res.json({
                msg: result.msg,
                error: result.error,
                data: {
                    ...result.data,
                    token,
                },
            });
            return;
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putResetPassword(req, res) {
    try{
        res.json(await usersOPerationsManagmentFunctions.resetUserPassword(req.params.userId, req.query.newPassword));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteProductFromFavoriteUserProducts(req, res) {
    try{
        res.json(await usersOPerationsManagmentFunctions.deleteProductFromFavoriteUserProducts(req.data._id, req.query.productId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteProductFromUserProductsWallet(req, res) {
    try{
        res.json(await usersOPerationsManagmentFunctions.deleteProductFromUserProductsWallet(req.data._id, req.query.productId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
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