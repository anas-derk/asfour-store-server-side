const mongoose = require("mongoose");

require("dotenv").config({
    path: "../.env",
});

// create Admin User Schema For Admin User Model

const admin_user_schema = mongoose.Schema({
    email: String,
    password: String,
});

// create Admin User Model In Database

const admin_user_model = mongoose.model("admin", admin_user_schema);

// require bcryptjs module for password encrypting

const { hash } = require("bcryptjs");

const userInfo = {
    email: "admin@gmail.com",
    password: "12345678",
};

async function create_admin_user_account() {
    try {
        await mongoose.connect(process.env.DB_URL);
        let user = await admin_user_model.findOne({ email: userInfo.email });
        if (user) {
            await mongoose.disconnect();
            return "Sorry, Can't Insert Admin Data To Database Because it is Exist !!!";
        } else {
            let password = userInfo.password;
            let encrypted_password = await hash(password, 10);
            userInfo.password = encrypted_password;
            let new_admin_user = new admin_user_model(userInfo);
            await new_admin_user.save();
            await mongoose.disconnect();
            return "Ok !!, Create Admin Account Has Been Successfuly !!";
        }
    } catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

create_admin_user_account().then((result) => console.log(result));