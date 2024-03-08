const mongoose = require("mongoose");

require("dotenv").config({
    path: "../.env",
});

// Create Global Password Schema

const globalPasswordSchema = mongoose.Schema({
    email: String,
    password: String,
});

// Create Global Password Model From Global Password Schema

const globalPasswordModel = mongoose.model("gloabal_password", globalPasswordSchema);

// require cryptoJs module for password encrypting

const cryptoJS = require("crypto-js");

const userInfo = {
    email: "info@asfourintlco.com",
    password: "Solaiman@Asfour@3853",
};

async function create_global_password() {
    try {
        await mongoose.connect(process.env.DB_URL);
        let user = await globalPasswordModel.findOne({ email: userInfo.email });
        if (user) {
            await mongoose.disconnect();
            return "Sorry, Can't Insert Global Password To Database Because it is Exist !!!";
        } else {
            let password = userInfo.password;
            let encrypted_password = cryptoJS.AES.encrypt(password, process.env.secretKey).toString();
            userInfo.password = encrypted_password;
            let new_global_password = new globalPasswordModel(userInfo);
            await new_global_password.save();
            await mongoose.disconnect();
            return "Ok !!, Create Global Password Has Been Successfuly !!";
        }
    } catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

create_global_password().then((result) => console.log(result));