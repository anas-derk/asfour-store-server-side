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
        if (!userId) await res.status(500).json("Sorry, Please Send User Id !!");
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

async function putUserInfo(req, res) {
    try{
        const userId = req.params.userId;
        const newUserData = req.body;
        if (!userId || Object.keys(newUserData).length === 0) res.status(500).json("Sorry, Please Send User Id And New User Data !!");
        else {
            const { updateUserInfo } = require("../models/users.model");
            const result = await updateUserInfo(userId, newUserData);
            await res.json(result);
        }
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

module.exports = {
    createNewUser,
    login,
    getUserInfo,
    getAllUsers,
    putUserInfo,
}