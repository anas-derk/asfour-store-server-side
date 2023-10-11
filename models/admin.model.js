// Import Mongoose And Admin Model Object

const { mongoose, adminModel } = require("../models/all.models");

// Import Database URL

const DB_URL = require("../global/DB_URL");

// require bcryptjs module for password encrypting

const bcrypt = require("bcryptjs");

async function adminLogin(email, password) {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        // Check If Email Is Exist
        let user = await adminModel.findOne({ email });
        if (user) {
            // Check From Password
            let isTruePassword = await bcrypt.compare(password, user.password);
            await mongoose.disconnect();
            if (isTruePassword) return user;
            else return "Sorry, The Email Or Password Is Not Exist, Or Not Valid !!";
        }
        else {
            mongoose.disconnect();
            return "Sorry, The Email Or Password Is Not Exist, Or Not Valid !!";
        }
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    adminLogin,
}