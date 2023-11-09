// Import Mongoose And Product Model Object

const { mongoose, productModel } = require("../models/all.models");

async function addNewProduct(productInfo) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const newProductInfo = new productModel(productInfo);
        await newProductInfo.save();
        await mongoose.disconnect();
        return "Adding New Product Process It Successfuly ...";
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getProductInfo(productId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const productInfo = await productModel.findById(productId);
        if (productInfo) {
            await mongoose.disconnect();
            return productInfo;
        }
        else {
            await mongoose.disconnect();
            return "Sorry, This Product It Not Exist !!!";
        }
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllProducts() {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const allProducts = await productModel.find({}).sort({ postOfDate: -1 });
        await mongoose.disconnect();
        return allProducts;
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function deleteProduct(productId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const productInfo = await productModel.findOneAndDelete({
            _id: productId,
        });
        await mongoose.disconnect();
        return [productInfo.imagePath, ...productInfo.galleryImagesPaths];
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function updateProduct(productId, newData) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        await productModel.updateOne({_id: productId}, {...newData});
        await mongoose.disconnect();
        return "Updating Product Process It Successfuly ...";
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    addNewProduct,
    getProductInfo,
    deleteProduct,
    getAllProducts,
    updateProduct,
}