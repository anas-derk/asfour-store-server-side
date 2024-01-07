// Import Mongoose And Brand Model Object

const { mongoose, brandModel } = require("../models/all.models");

async function addNewBrand(brandInfo) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const newBrandInfo = new brandModel(brandInfo);
        await newBrandInfo.save();
        await mongoose.disconnect();
        return "Adding New Brand Process Has Been Successfuly ...";
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllBrands() {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const allBrands = await brandModel.find({});
        await mongoose.disconnect();
        return allBrands;
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function deleteBrand(brandId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const brandInfo = await brandModel.findOneAndDelete({
            _id: brandId,
        });
        await mongoose.disconnect();
        return brandInfo.imagePath;
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function updateBrandInfo(brandId, newBrandTitle) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        await brandModel.updateOne( { _id: brandId } , { title: newBrandTitle });
        await mongoose.disconnect();
        return "Updating Brand Info Process Has Been Successfuly ...";
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    addNewBrand,
    getAllBrands,
    deleteBrand,
    updateBrandInfo,
}