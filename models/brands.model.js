// Import Brand Model Object

const { brandModel } = require("../models/all.models");

async function addNewBrand(brandInfo) {
    try {
        const newBrandInfo = new brandModel(brandInfo);
        await newBrandInfo.save();
        return {
            msg: "Adding New Brand Process Has Been Successfuly ...",
            error: false,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllBrands() {
    try {
        return await brandModel.find({});
    }
    catch (err) {
        throw Error(err);
    }
}

async function getBrandsCount(filters) {
    try {
        return await brandModel.countDocuments(filters);
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllBrandsInsideThePage(pageNumber, pageSize) {
    try {
        return await brandModel.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize);
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteBrand(brandId) {
    try {
        const brandInfo = await brandModel.findOneAndDelete({
            _id: brandId,
        });
        if (brandInfo) {
            const newBrandsList = await brandModel.find({});
            return {
                deletedBrandPath: brandInfo.imagePath,
                isError: false,
                msg: "Deleting Brand Process Has Been Successfuly ...",
                newBrandsList,
            };
        }
        return {
            msg: "Sorry, This Brand Id Is Not Exist !!",
            isError: true,
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateBrandInfo(brandId, newBrandTitle) {
    try {
        await brandModel.updateOne( { _id: brandId } , { title: newBrandTitle });
        return "Updating Brand Info Process Has Been Successfuly ...";
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateBrandImage(brandId, newBrandImagePath) {
    try{
        const { imagePath } = await brandModel.findById(brandId);
        await brandModel.updateOne({ _id: brandId }, {
            imagePath: newBrandImagePath,
        });
        return imagePath;
    }
    catch(err) {
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