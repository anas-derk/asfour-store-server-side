// Import Mongoose And Password Model Object

const { mongoose, globalPasswordModel } = require("./all.models");

// require cryptoJs module for password encrypting

const cryptoJS = require("crypto-js");

async function getPasswordForBussinessEmail(email){
    try{
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await globalPasswordModel.findOne({ email });
        if (user) {
            // Check From Password
            const bytes = cryptoJS.AES.decrypt(user.password, process.env.secretKey);
            const decryptedPassword = bytes.toString(cryptoJS.enc.Utf8);
            return {
                msg: "Get Password For Bussiness Email Process Has Been Successfully !!",
                error: false,
                data: decryptedPassword,
            }
        }
        await mongoose.disconnect();
        return {
            msg: "Sorry, Email Incorrect !!",
            error: true,
            data: {},
        }
    }
    catch(err){
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function changeBussinessEmailPassword(email, password, newPassword) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await globalPasswordModel.findOne({ email });
        if (user) {
            // Check From Password
            const bytes = cryptoJS.AES.decrypt(user.password, process.env.secretKey);
            const decryptedPassword = bytes.toString(cryptoJS.enc.Utf8);
            if (decryptedPassword === password) {
                let encrypted_password = cryptoJS.AES.encrypt(newPassword, process.env.secretKey).toString();
                await globalPasswordModel.updateOne({ password: encrypted_password });
                await mongoose.disconnect();
                return {
                    msg: "Changing Global Password Process Has Been Successfully !!",
                    error: false,
                    data: {},
                }
            }
            await mongoose.disconnect();
            return {
                msg: "Sorry, Email Or Password Incorrect !!",
                error: true,
                data: {},
            }
        }
        await mongoose.disconnect();
        return {
            msg: "Sorry, Email Or Password Incorrect !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    getPasswordForBussinessEmail,
    changeBussinessEmailPassword,
}