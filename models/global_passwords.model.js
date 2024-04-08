// Import Global Password Model And Admin Model Object

const { globalPasswordModel, adminModel, mongoose } = require("./all.models");

// require cryptoJs module for password encrypting

const cryptoJS = require("crypto-js");

async function getPasswordForBussinessEmail(email){
    try{
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
        return {
            msg: "Sorry, Email Incorrect !!",
            error: true,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

async function changeBussinessEmailPassword(authorizationId, email, password, newPassword) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if ((new mongoose.Types.ObjectId(authorizationId)).equals(admin._id) && !admin.isBlocked) {
                const user = await globalPasswordModel.findOne({ email });
                if (user) {
                    const bytes = cryptoJS.AES.decrypt(user.password, process.env.secretKey);
                    const decryptedPassword = bytes.toString(cryptoJS.enc.Utf8);
                    if (decryptedPassword === password) {
                        const encrypted_password = cryptoJS.AES.encrypt(newPassword, process.env.secretKey).toString();
                        await globalPasswordModel.updateOne({ password: encrypted_password });
                        return {
                            msg: "Changing Global Password Process Has Been Successfully !!",
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: "Sorry, Email Or Password Incorrect !!",
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, Email Or Password Incorrect !!",
                    error: true,
                    data: {},
                }
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    getPasswordForBussinessEmail,
    changeBussinessEmailPassword,
}