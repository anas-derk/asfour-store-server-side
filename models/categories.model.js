// Import Category Model Object

const { categoryModel, adminModel, mongoose } = require("../models/all.models");

async function addNewCategory(authorizationId, storeIdAndCategoryName) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if ((new mongoose.Types.ObjectId(authorizationId)).equals(admin._id) && !admin.isBlocked) {
                const category = await categoryModel.findOne({ name: storeIdAndCategoryName.categoryName });
                if (category) {
                    return {
                        msg: "Sorry, This Cateogry Is Already Exist !!",
                        error: true,
                        data: {},
                    }
                }
                const newCategory = new categoryModel({
                    name: storeIdAndCategoryName.categoryName,
                    storeId: storeIdAndCategoryName.storeId,
                });
                await newCategory.save();
                return {
                    msg: "Adding New Category Process Has Been Successfuly ...",
                    error: false,
                    data: {},
                }
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
    catch(err){
        throw Error(err);
    }
}

async function getAllCategories(filters) {
    try {
        return {
            msg: "Get All Categories Process Has Been Successfully !!",
            error: false,
            data: await categoryModel.find(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getCategoriesCount(filters) {
    try {
        return {
            msg: "Get All Categories Process Has Been Successfully !!",
            error: false,
            data: await categoryModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllCategoriesInsideThePage(pageNumber, pageSize, filters) {
    try {
        return {
            msg: `Get All Categories Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await categoryModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteCategory(authorizationId, categoryId) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if ((new mongoose.Types.ObjectId(authorizationId)).equals(admin._id) && !admin.isBlocked) {
                const category = await categoryModel.findOneAndDelete({
                    _id: categoryId,
                });
                if (category) {
                    return {
                        msg: "Deleting Category Process Has Been Successfuly ...",
                        error: false,
                        data: {},
                    };
                }
                return {
                    msg: "Sorry, This Category Is Not Exist !!",
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

async function updateCategory(authorizationId, categoryId, newCategoryName) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if ((new mongoose.Types.ObjectId(authorizationId)).equals(admin._id) && !admin.isBlocked) {
                const category = await categoryModel.findOneAndUpdate( { _id: categoryId } , { name: newCategoryName });
                if (category) {
                    return {
                        msg: "Updating Category Process Has Been Successfuly !!",
                        error: false,
                        data: {},
                    };
                }
                return {
                    msg: "Sorry, This Category Is Not Exist !!",
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

module.exports = {
    addNewCategory,
    getAllCategories,
    getCategoriesCount,
    getAllCategoriesInsideThePage,
    deleteCategory,
    updateCategory,
}