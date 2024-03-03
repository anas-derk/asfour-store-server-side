// Import Mongoose And Admin Model Object

const { mongoose, adminModel } = require("../models/all.models");

async function adminLogin(email, password) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await adminModel.findOne({ email });
        if (user) {
            // require bcryptjs module for password encrypting
            const { compare } = require("bcryptjs");
            // Check From Password
            const isTruePassword = await compare(password, user.password);
            await mongoose.disconnect();
            if (isTruePassword) return {
                msg: "Admin Logining Process Has Been Successfully !!",
                error: false,
                data: {
                    _id: user._id,
                },
            };
            return {
                msg: "Sorry, The Email Or Password Is Not Exist, Or Not Valid !!",
                error: true,
                data: {},
            }
        }
        await mongoose.disconnect();
        return {
            msg: "Sorry, The Email Or Password Is Not Exist, Or Not Valid !!",
            error: true,
            data: {},
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
        const user = await adminModel.findById(userId);
        await mongoose.disconnect();
        if (user) return {
            msg: `Get Admin Info For Id: ${user._id} Process Has Been Successfully !!`,
            error: false,
            data: user,
        }
        return {
            msg: "Sorry, The User Is Not Exist, Please Enter Another User Id !!",
            error: true,
            data: {},
        }
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