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

async function getBrandsCount(filters) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const brandsCount = await brandModel.countDocuments(filters);
        await mongoose.disconnect();
        return brandsCount;
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllBrandsInsideThePage(pageNumber, pageSize) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const brandsListInsideThePage = await brandModel.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize);
        await mongoose.disconnect();
        return brandsListInsideThePage;
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
        if (brandInfo) {
            const newBrandsList = await brandModel.find({});
            await mongoose.disconnect();
            return {
                deletedBrandPath: brandInfo.imagePath,
                isError: false,
                msg: "Deleting Brand Process Has Been Successfuly ...",
                newBrandsList,
            };
        }
        await mongoose.disconnect();
        return {
            msg: "Sorry, This Brand Id Is Not Exist !!",
            isError: true,
        };
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

async function updateBrandImage(brandId, newBrandImagePath) {
    try{
        await mongoose.connect(process.env.DB_URL);
        const { imagePath } = await brandModel.findById(brandId);
        await brandModel.updateOne({ _id: brandId }, {
            imagePath: newBrandImagePath,
        });
        await mongoose.disconnect();
        return imagePath;
    }
    catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

module.exports = {
    addNewBrand,
    getAllBrands,
    getBrandsCount,
    getAllBrandsInsideThePage,
    deleteBrand,
    updateBrandInfo,
    updateBrandImage,
}