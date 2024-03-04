const { getResponseObject } = require("../global/functions");

async function createNewUser(req, res) {
    try {
        const email = req.body.email,
            password = req.body.password;
        // Start Handle Email Value To Check It Before Save In DB
        const { isEmail } = require("../global/functions");
        // Check If Email, Password And Country Are Exist
        if (email.length > 0 && password.length > 0) {
            // Check If Email Valid
            if (isEmail(email)) {
                const { createNewUser } = require("../models/users.model");
                await res.json(await createNewUser(email.toLowerCase(), password));
                return;
            }
            // Return Error Msg If Email Is Not Valid
            await res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
            return;
        }
        await res.status(400).json(getResponseObject("Error, Please Send Email And Password Or Rest Input !!", true, {}));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function postNewFavoriteProduct(req, res) {
    try{
        const   userId = req.query.userId,
                productId = req.query.productId;
        if (!userId || !productId) {
            await res.status(400).json(getResponseObject("Sorry, Please Send User Id And Product Id !!", true, {}));
            return;
        }
        const { addNewFavoriteProduct } = require("../models/users.model");
        await res.json(await addNewFavoriteProduct(userId, productId));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function postAccountVerificationCode(req, res) {
    try{
        const userEmail = req.query.email;
        const { isEmail } = require("../global/functions");
        if (!userEmail) {
            await res.status(400).json(getResponseObject("Sorry, Please Send The Email !!", true, {}));
            return;
        }
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
        await res.json(await sendCodeToUserEmail(userEmail));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function login(req, res) {
    try{
        const   email = req.query.email,
                password = req.query.password;
        // Start Handle Email Value To Check It Before Save In DB
        const { isEmail } = require("../global/functions");
        // Check If Email And Password Are Exist
        if (email.length > 0 && password.length > 0) {
            // Check If Email Valid
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
                            token,
                        },
                    });
                    return;
                }
                await res.json(result);
                return;
            }
            // Return Error Msg If Email Is Not Valid
            await res.status(400).json(getResponseObject("Error, This Is Not Email Valid !!", true, {}));
            return;
        }
        await res.status(400).json(getResponseObject("Error, Please Enter Email And Password Or Rest Input !!", true, {}));
    }
    catch(err){
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getUserInfo(req, res) {
    try{
        const userId = req.params.userId;
        if (!userId) {
            await res.status(400).json(getResponseObject("Sorry, Please Send User Id !!", true, {}));
            return;
        }
        const { getUserInfo } = require("../models/users.model");
        await res.json(await getUserInfo(userId));
    }
    catch(err){
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getAllUsers(req, res) {
    try{
        const { getAllUsers } = require("../models/users.model");
        await res.json(await getAllUsers());
    }
    catch(err){
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getForgetPassword(req, res) {
    try{
        const email = req.query.email;
        if (email) {
            const { isEmail } = require("../global/functions");
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
            return;
        }
        await res.status(400).json(getResponseObject("Sorry, Please Send Email !!", true, {}));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
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
        for (let objectKey in filters) {
            if (
                objectKey !== "customerId"
            ) {
                await res.status(400).json(getResponseObject("Invalid Request, Please Send Valid Keys !!", true, {}));
                return;
            }
        }
        const { getFavoriteProductsCount } = require("../models/users.model");
        await res.json(await getFavoriteProductsCount(getFiltersObject(filters)));
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getWalletProductsCount(req, res) {
    try {
        const filters = req.query;
        for (let objectKey in filters) {
            if (
                objectKey !== "customerId"
            ) {
                await res.status(400).json(getResponseObject("Invalid Request, Please Send Valid Keys !!", true, {}));
                return;
            }
        }
        const { getWalletProductsCount } = require("../models/users.model");
        await res.json(await getWalletProductsCount(getFiltersObject(filters)));
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getAllFavoriteProductsInsideThePage(req, res) {
    try{
        const filters = req.query;
        for (let objectKey in filters) {
            if (
                objectKey !== "pageNumber" &&
                objectKey !== "pageSize" &&
                objectKey !== "customerId"
            ) {
                await res.status(400).json(getResponseObject("Invalid Request, Please Send Valid Keys !!", true, {}));
                return;
            }
        }
        const { getAllFavoriteProductsInsideThePage } = require("../models/users.model");
        await res.json(await getAllFavoriteProductsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch(err){
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getAllWalletProductsInsideThePage(req, res) {
    try{
        const filters = req.query;
        for (let objectKey in filters) {
            if (
                objectKey !== "pageNumber" &&
                objectKey !== "pageSize" &&
                objectKey !== "customerId"
            ) {
                await res.status(400).json(getResponseObject("Invalid Request, Please Send Valid Keys !!", true, {}));
                return;
            }
        }
        const { getAllWalletProductsInsideThePage } = require("../models/users.model");
        await res.json(await getAllWalletProductsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch(err){
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putUserInfo(req, res) {
    try{
        const userId = req.params.userId;
        const newUserData = req.body;
        if (!userId || Object.keys(newUserData).length === 0) {
            await res.status(400).json(getResponseObject("Sorry, Please Send User Id And New User Data !!", true, {}));
            return;
        }
        const { updateUserInfo } = require("../models/users.model");
        await res.json(await updateUserInfo(userId, newUserData));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putVerificationStatus(req, res) {
    try{
        const email = req.query.email;
        if (!email) {
            await res.status(400).json(getResponseObject("Sorry, Please Send User Email !!", true, {}));
            return;
        }
        const { updateVerificationStatus } = require("../models/users.model");
        await res.json(await updateVerificationStatus(email));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putResetPassword(req, res) {
    try{
        const userId = req.params.userId;
        if (!userId) {
            await res.status(400).json(getResponseObject("Sorry, Please Send All Required Fields !!", true, {}));
            return;
        }
        const newPassword = req.query.newPassword;
        const { resetUserPassword } = require("../models/users.model");
        await res.json(await resetUserPassword(userId, newPassword));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function deleteProductFromFavoriteUserProducts(req, res) {
    try{
        const   userId = req.query.userId,
                productId = req.query.productId;
        if (!userId || !productId) {
            await res.status(400).json(getResponseObject("Sorry, Please Send User Id And Product Id !!", true, {}));
            return;
        }
        const { deleteProductFromFavoriteUserProducts } = require("../models/users.model");
        await res.json(await deleteProductFromFavoriteUserProducts(userId, productId));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function deleteProductFromUserProductsWallet(req, res) {
    try{
        const   userId = req.query.userId,
                productId = req.query.productId;
        if (!userId || !productId) {
            await res.status(400).json(getResponseObject("Sorry, Please Send User Id And Product Id !!", true, {}));
            return;
        }
        const { deleteProductFromUserProductsWallet } = require("../models/users.model");
        await res.json(await deleteProductFromUserProductsWallet(userId, productId));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

module.exports = {
    createNewUser,
    postNewFavoriteProduct,
    postAccountVerificationCode,
    login,
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