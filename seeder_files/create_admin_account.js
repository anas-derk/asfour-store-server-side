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
    password: {
        type: String,
        required: true,
    },
    isWebsiteOwner: {
        type: Boolean,
        default: false,
    },
    isMainAdmin: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isMerchant: {
        type: Boolean,
        default: false,
    },
    storeNamesAndIds: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                },
                id: {
                    type: String,
                    required: true,
                },
            }
        ],
        required: true,
    },
    permissions: {
        addNewBrand: {
            type: Boolean,
            default: true,
        },
        updateBrandInfo: {
            type: Boolean,
            default: true,
        },
        deleteBrand: {
            type: Boolean,
            default: true,
        },
        updateOrderInfo: {
            type: Boolean,
            default: true,
        },
        deleteOrder: {
            type: Boolean,
            default: true,
        },
        updateOrderProductInfo: {
            type: Boolean,
            default: true,
        },
        deleteOrderProduct: {
            type: Boolean,
            default: true,
        },
        addNewCategory: {
            type: Boolean,
            default: true,
        },
        updateCategoryInfo: {
            type: Boolean,
            default: true,
        },
        deleteCategory: {
            type: Boolean,
            default: true,
        },
        addNewProduct: {
            type: Boolean,
            default: true,
        },
        updateProductInfo: {
            type: Boolean,
            default: true,
        },
        deleteProduct: {
            type: Boolean,
            default: true,
        },
        showAndHideSections: {
            type: Boolean,
            default: false,
        },
        addNewAdmin: {
            type: Boolean,
            default: true,
        },
        changeBussinessEmailPassword: {
            type: Boolean,
            default: false,
        },
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    blockingReason: String,
});

// create Admin User Model In Database

const adminModel = mongoose.model("admin", adminSchema);

// require bcryptjs module for password encrypting

const { hash } = require("bcryptjs");

const userInfo = {
    firstName: "Soliman",
    lastName: "Asfour",
    email: process.env.MAIN_ADMIN_EMAIL,
    password: process.env.MAIN_ADMIN_PASSWORD,
    isWebsiteOwner: true,
    isMainAdmin: true,
    isAdmin: true,
    isMerchant: true,
    storeNamesAndIds: [
        {
            name: "Ubuyblues",
            id: "660b10d0b6087fd48cf059ae",
        }
    ],
    permissions: {
        deleteProduct: true,
        showAndHideSections: true,
        addNewAdmin: true,
        changeBussinessEmailPassword: true,
    },
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