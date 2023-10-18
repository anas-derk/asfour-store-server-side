// Import Mongoose

const mongoose = require("mongoose");

// Create Admin Schema

const adminSchema = mongoose.Schema({
    email: String,
    password: String,
});

// Create Admin Model From Admin Schema

const adminModel = mongoose.model("admin", adminSchema);

// Create Product Schema

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String,
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

// Create User Schema

const userSchema = mongoose.Schema({
    email: String,
    password: String,
});

// Create User Model From User Schema

const userModel = mongoose.model("user", userSchema);

// Create Category Schema

const categorySchema = mongoose.Schema({
    name: String,
});

// Create Category Model From Category Schema

const categoryModel = mongoose.model("category", categorySchema);

module.exports = {
    mongoose,
    adminModel,
    productModel,
    userModel,
    categoryModel,
}