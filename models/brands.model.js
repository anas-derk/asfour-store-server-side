// Import Brand Model Object

const { brandModel, adminModel, storeModel } = require("../models/all.models");

async function addNewBrand(authorizationId, brandInfo) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if (!admin.isBlocked && admin.storeId === brandInfo.storeId) {
                const newBrandInfo = new brandModel(brandInfo);
                await newBrandInfo.save();
                return {
                    msg: "Adding New Brand Process Has Been Successfuly ...",
                    error: false,
                    data: {},
                };
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getLastSevenBrandsByStoreId(filters) {
    try {
        if (filters["isMainStore"]) {
            const mainStoreDetails = await storeModel.findOne({ isMainStore: true });
            filters = { storeId: mainStoreDetails._id };
        }
        return {
            msg: "Get All Brands Process Has Been Successfully !!",
            error: false,
            data: await brandModel.find(filters).limit(7),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getBrandsCount(filters) {
    try {
        return {
            msg: "Get Brands Count Process Has Been Successfully !!",
            error: false,
            data: await brandModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllBrandsInsideThePage(pageNumber, pageSize, filters) {
    try {
        return {
            msg: `Get All Brands Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await brandModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize),
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteBrand(authorizationId, brandId) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if (!admin.isBlocked) {
                const brandInfo = await brandModel.findOne({
                    _id: brandId,
                });
                if (brandInfo) {
                    if (brandInfo.storeId === admin.storeId) {
                        await brandModel.deleteOne({ _id: brandId });
                        return {
                            error: false,
                            msg: "Deleting Brand Process Has Been Successfuly ...",
                            data: {
                                deletedBrandPath: brandInfo.imagePath,
                            },
                        };
                    }
                    return {
                        msg: "Sorry, Permission Denied !!",
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, This Brand Id Is Not Exist !!",
                    error: true,
                    data: {},
                };
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateBrandInfo(authorizationId, brandId, newBrandTitle) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if (!admin.isBlocked) {
                const brandInfo = await brandModel.findOne({ _id: brandId });
                if (brandInfo) {
                    if (brandInfo.storeId === admin.storeId) {
                        await brandModel.updateOne( { _id: brandId } , { title: newBrandTitle });
                        return {
                            msg:  "Updating Brand Info Process Has Been Successfuly ...",
                            error: false,
                            data: {},
                        };
                    }
                    return {
                        msg: "Sorry, Permission Denied !!",
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, This Brand Is Not Exist !!",
                    error: true,
                    data: {},
                };
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function changeBrandImage(authorizationId, brandId, newBrandImagePath) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if (!admin.isBlocked) {
                const brand = await brandModel.findOne({ _id: brandId });
                if (brand) {
                    if (brand.storeId === admin.storeId) {
                        await brandModel.updateOne({ _id: brandId }, {
                            imagePath: newBrandImagePath,
                        });
                        return {
                            msg: "Updating Brand Image Process Has Been Successfully !!",
                            error: false,
                            data: { deletedBrandImagePath: brand.imagePath }
                        };
                    }
                    return {
                        msg: "Sorry, Permission Denied !!",
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, This Brand Is Not Exist !!",
                    error: true,
                    data: {}
                };
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

module.exports = {
    addNewBrand,
    getLastSevenBrandsByStoreId,
    getBrandsCount,
    getAllBrandsInsideThePage,
    deleteBrand,
    updateBrandInfo,
    changeBrandImage,
}