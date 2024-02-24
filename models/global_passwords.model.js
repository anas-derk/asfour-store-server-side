// Import Mongoose And Password Model Object

const { mongoose, globalPasswordModel } = require("./all.models");

// require cryptoJs module for password encrypting

const cryptoJS = require("crypto-js");

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
                return "Changing Global Password Process Has Been Successfully !!";
            }
            return "Sorry, Email Or Password Incorrect !!";
        }
        await mongoose.disconnect();
        return "Sorry, Email Or Password Incorrect !!";
    }
    catch (err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    changeBussinessEmailPassword,
}