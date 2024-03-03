// Import Mongoose And Admin Model Object

const { mongoose, adminModel } = require("../models/all.models");

async function adminLogin(email, password) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        let user = await adminModel.findOne({ email });
        if (user) {
            // require bcryptjs module for password encrypting
            const { compare } = require("bcryptjs");
            // Check From Password
            let isTruePassword = await compare(password, user.password);
            await mongoose.disconnect();
            if (isTruePassword) return user;
            return "Sorry, The Email Or Password Is Not Exist, Or Not Valid !!";
        }
        else {
            await mongoose.disconnect();
            return "Sorry, The Email Or Password Is Not Exist, Or Not Valid !!";
        }
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAdminUserInfo(userId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If User Is Exist
        let user = await adminModel.findById(userId);
        await mongoose.disconnect();
        if (user) return user;
        return "Sorry, The User Is Not Exist !!, Please Enter Another User Id ..";
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    adminLogin,
    getAdminUserInfo,
}