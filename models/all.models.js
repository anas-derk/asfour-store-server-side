// Import Mongoose

const mongoose = require("mongoose");

// Create User Schema

const adminSchema = mongoose.Schema({
    email: String,
    password: String,
});

// Create User Model From User Schema

const adminModel = mongoose.model("admin", adminSchema);

// Create Product Schema

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    numberOfOrders: {
        type: Number,
        default: 0,
    },
    postOfDate: {
        type: Date,
        default: Date.now(),
    },
    imagePath: String,
});

// Create Product Model From Product Schema

const productModel = mongoose.model("product", productSchema);

module.exports = {
    mongoose,
    adminModel,
    productModel,
}