const { getResponseObject } = require("../global/functions");

const adminsOPerationsManagmentFunctions = require("../models/admins.model");

const { sign } = require("jsonwebtoken");

async function getAdminLogin(req, res) {
    try{
        const emailAndPassword = req.query;
        const result = await adminsOPerationsManagmentFunctions.adminLogin(emailAndPassword.email.trim().toLowerCase(), emailAndPassword.password);
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

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "firstName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "lastName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "email") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function getAdminsCount(req, res) {
    try{
        const result = await adminsOPerationsManagmentFunctions.getAdminsCount(req.data._id, getFiltersObject(req.query));
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Merchant Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllAdminsInsideThePage(req, res) {
    try{
        const filters = req.query;
        const result = await adminsOPerationsManagmentFunctions.getAllAdminsInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, getFiltersObject(filters));
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Merchant Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postAddNewAdmin(req, res) {
    try{
        const result = await adminsOPerationsManagmentFunctions.addNewAdmin(req.data._id, req.body);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putAdminPassword(req, res) {
    try{
        const data = req.query;
        const result = await adminsOPerationsManagmentFunctions.changeAdminPassword(req.data._id, data.websiteOwnerEmail.trim().toLowerCase(), data.websiteOwnerPassword, data.adminEmail.trim().toLowerCase(), data.newAdminPassword);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putAdminInfo(req, res) {
    try{
        const result = await adminsOPerationsManagmentFunctions.updateAdminInfo(req.data._id, req.params.adminId, req.body);
        if (result.error) {
            if (
                result.msg === "Sorry, Permission Denied !!" ||
                result.msg === "Sorry, This Admin Is Not Exist !!" ||
                result.msg === "Sorry, This Account Has Been Blocked !!"
            ) {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteAdmin(req, res) {
    try{
        const result = await adminsOPerationsManagmentFunctions.deleteAdmin(req.data._id, req.params.adminId);
        if (result.error) {
            if (
                result.msg === "Sorry, Permission Denied !!" ||
                result.msg === "Sorry, This Admin Is Not Exist !!" ||
                result.msg === "Sorry, This Account Has Been Blocked !!"
            ) {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    getAdminLogin,
    getAdminUserInfo,
    getAdminsCount,
    getAllAdminsInsideThePage,
    postAddNewAdmin,
    putAdminPassword,
    putAdminInfo,
    deleteAdmin
}