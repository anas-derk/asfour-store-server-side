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

module.exports = {
    addNewBrand,
}