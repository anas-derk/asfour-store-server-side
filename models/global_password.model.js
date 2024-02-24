// Import Mongoose And Password Model Object

const { mongoose, globalPasswordModel } = require("../models/all.models");

// require cryptoJs module for password encrypting

const cryptoJS = require("crypto-js");

async function changeBussinessEmailPassword(email, password, newPassword) {
    try{
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        // Check If Email Is Exist
        const user = await globalPasswordModel.findOne({ email });
        if (user) {
            // Check From Password
            const bytes = cryptoJS.AES.decrypt(user.password, process.env.secretKey);
            const decryptedPassword = bytes.toString(cryptoJS.enc.Utf8);
            console.log(decryptedPassword);
            if (decryptedPassword === password) {
                console.log("aa");
                await mongoose.disconnect();
            }
            return "Sorry, Email Or Password Incorrect !!";
        }
        await mongoose.disconnect();
        return "Sorry, Email Or Password Incorrect !!";
    }
    catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    changeBussinessEmailPassword,
}