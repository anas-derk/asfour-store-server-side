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
                const result = await createNewUser(email.toLowerCase(), password);
                await res.json(result);
            }
            else {
                // Return Error Msg If Email Is Not Valid
                await res.status(400).json("Error, This Is Not Email Valid !!");
            }
        } else {
            await res.status(400).json("Error, Please Enter Email And Password Or Rest Input !!");
        }
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function postNewFavoriteProduct(req, res) {
    try{
        const   userId = req.query.userId,
                productId = req.query.productId;
        if (!userId || !productId) await res.status(400).json("Sorry, Please Send User Id And Product Id !!");
        else {
            const { addNewFavoriteProduct } = require("../models/users.model");
            const result = await addNewFavoriteProduct(userId, productId);
            await res.json(result);
        }
    }
    catch(err) {
        console.log(err);
        await res.status(500).json(err);
    }
}

async function postAccountVerificationCode(req, res) {
    try{
        const userEmail = req.query.email;
        const { isEmail } = require("../global/functions");
        if (!userEmail) await res.status(400).json("Sorry, Please Send The Email !!");
        else {
            if (!isEmail(userEmail)) {
                await res.status(400).json("Sorry, Please Send Valid Email !!");
            } else {
                const { isExistUserAndVerificationEmail } = require("../models/users.model");
                const result = await isExistUserAndVerificationEmail(userEmail);
                if (result === "Sorry, The User Is Not Exist !!, Please Enter Another User Email .." || result === "Sorry, The Email For This User Has Been Verified !!") {
                    await res.status(400).json(result);
                } else {
                    const { sendCodeToUserEmail } = require("../global/functions");
                    const verificationCode = await sendCodeToUserEmail(userEmail);
                    await res.json(verificationCode);
                }
            }
        }
    }
    catch(err) {
        await res.status(500).json(err);
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
                await res.json(result);
            } else {
                // Return Error Msg If Email Is Not Valid
                await res.status(400).json("Error, This Is Not Email Valid !!");
            }
        } else {
            await res.status(400).json("Error, Please Enter Email And Password Or Rest Input !!");
        }
    }
    catch(err){
        await res.status(500).json(err);
    }
}

async function getUserInfo(req, res) {
    try{
        const userId = req.params.userId;
        if (!userId) await res.status(400).json("Sorry, Please Send User Id !!");
        else {
            const { getUserInfo } = require("../models/users.model");
            const result = await getUserInfo(userId);
            await res.json(result);
        }
    }
    catch(err){
        await res.status(500).json(err);
    }
}

async function getAllUsers(req, res) {
    try{
        const { getAllUsers } = require("../models/users.model");
        const result = await getAllUsers();
        await res.json(result);
    }
    catch(err){
        await res.status(500).json(err);
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
                if (result) {
                    const { sendCodeToUserEmail } = require("../global/functions");
                    const generatedCode = await sendCodeToUserEmail(email);
                    await res.json({
                        _id: result._id,
                        isVerified: result.isVerified,
                        code: generatedCode,
                    });
                } else await res.json("Sorry, This Email Is Not Exist !!");
            }
            else await res.status(400).json("Sorry, Invalid Email !!");
        }
        else await res.status(400).json("Sorry, Please Send Email !!");
    }
    catch(err) {
        console.log(err)
        await res.status(500).json(err);
    }
}

async function getFavoriteProducts(req, res) {
    try{
        const userId = req.params.userId;
        if (!userId) await res.status(400).json("Sorry, Please Send User Id !!");
        else {
            const { getFavoriteProducts } = require("../models/users.model");
            const result = await getFavoriteProducts(userId);
            await res.json(result);
        }
    }
    catch(err){
        await res.status(500).json(err);
    }
}

async function putUserInfo(req, res) {
    try{
        const userId = req.params.userId;
        const newUserData = req.body;
        if (!userId || Object.keys(newUserData).length === 0) res.status(400).json("Sorry, Please Send User Id And New User Data !!");
        else {
            const { updateUserInfo } = require("../models/users.model");
            const result = await updateUserInfo(userId, newUserData);
            await res.json(result);
        }
    }
    catch(err) {
        console.log(err);
        await res.status(500).json(err);
    }
}

async function putVerificationStatus(req, res) {
    try{
        const email = req.query.email;
        if (!email) res.status(400).json("Sorry, Please Send User Email !!");
        else {
            const { updateVerificationStatus } = require("../models/users.model");
            const result = await updateVerificationStatus(email);
            await res.json(result);
        }
    }
    catch(err) {
        console.log(err);
        await res.status(500).json(err);
    }
}

async function putResetPassword(req, res) {
    try{
        const userId = req.params.userId;
        if (!userId) await res.status(400).json("Sorry, Please Send All Required Fields !!");
        else {
            const newPassword = req.query.newPassword;
            console.log(newPassword);
            const { resetUserPassword } = require("../models/users.model");
            const result = await resetUserPassword(userId, newPassword);
            await res.json(result);
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function deleteProductFromFavoriteUserProducts(req, res) {
    try{
        const   userId = req.query.userId,
                productId = req.query.productId;
        if (!userId || !productId) await res.status(400).json("Sorry, Please Send User Id And Product Id !!");
        else {
            const { deleteProductFromFavoriteUserProducts } = require("../models/users.model");
            const result = await deleteProductFromFavoriteUserProducts(userId, productId);
            await res.json(result);
        }
    }
    catch(err) {
        console.log(err);
        await res.status(500).json(err);
    }
}

module.exports = {
    createNewUser,
    postNewFavoriteProduct,
    postAccountVerificationCode,
    login,
    getUserInfo,
    getAllUsers,
    getFavoriteProducts,
    getForgetPassword,
    putUserInfo,
    putVerificationStatus,
    putResetPassword,
    deleteProductFromFavoriteUserProducts,
}