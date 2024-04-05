const mongoose = require("mongoose");

require("dotenv").config({
    path: "../.env",
});

// Create Store Schema

const storeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    ownerFirstName: {
        type: String,
        required: true,
    },
    ownerLastName: {
        type: String,
        required: true,
    },
    ownerEmail: {
        type: String,
        required: true,
    },
    productsType: {
        type: String,
        required: true,
    },
    productsDescription: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
        enum: [
            "pending",
            "approving",
            "rejecting",
            "blocking",
        ],
    },
    creatingOrderDate: {
        type: Date,
        default: Date.now(),
    },
    approveDate: Date,
    blockingDate: Date,
    dateOfCancelBlocking: Date,
});

// Create Store Model From Store Schema

const storeModel = mongoose.model("store", storeSchema);

const storeInfo = {
    name: "Ubuyblues",
    imagePath: "/",
    ownerFirstName: "Soliman",
    ownerLastName: "Asfour",
    ownerEmail: "admin@gmail.com",
    isApproved: true,
    productsType: "Multiple",
    productsDescription: "Welcome To Ubuyblues Store",
};

async function createStore() {
    try {
        await mongoose.connect(process.env.DB_URL);
        let newStore = new storeModel(storeInfo);
        await newStore.save();
        await mongoose.disconnect();
        return "Ok !!, Create Store Process Has Been Successfuly !!";
    } catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

createStore().then((result) => console.log(result));