const mongoose = require("mongoose");

require("dotenv").config({
    path: "../.env",
});

// create Admin User Schema For Admin User Model

const adminSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isMerchant: {
        type: Boolean,
        default: false,
    },
    storeName: {
        type: String,
        default: "",
    },
    storeId: {
        type: String,
        default: "",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    blockingReason: {
        type: String,
        required: true,
    },
});

// create Admin User Model In Database

const adminModel = mongoose.model("admin", adminSchema);

// require bcryptjs module for password encrypting

const { hash } = require("bcryptjs");

const userInfo = {
    firstName: "Soliman",
    lastName: "Asfour",
    email: "admin@gmail.com",
    password: String,
    isAdmin: true,
    isMerchant: true,
    storeName: "Ubuyblues",
    storeId: "",
};

async function create_admin_user_account() {
    try {
        await mongoose.connect(process.env.DB_URL);
        let user = await adminModel.findOne({ email: userInfo.email });
        if (user) {
            await mongoose.disconnect();
            return "Sorry, Can't Insert Admin Data To Database Because it is Exist !!!";
        }
        let password = userInfo.password;
        let encrypted_password = await hash(password, 10);
        userInfo.password = encrypted_password;
        let new_admin_user = new adminModel(userInfo);
        await new_admin_user.save();
        await mongoose.disconnect();
        return "Ok !!, Create Admin Account Process Has Been Successfuly !!";
    } catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

create_admin_user_account().then((result) => console.log(result));