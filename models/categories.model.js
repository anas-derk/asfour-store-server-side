// Import Category Model Object

const { categoryModel } = require("../models/all.models");

async function addNewCategory(categoryName) {
    try{
        const category = await categoryModel.findOne({ name: categoryName });
        if (category) {
            return {
                msg: "Sorry, This Cateogry Is Already Exist !!",
                error: true,
                data: {},
            }
        }
        const newCategory = new categoryModel({ name: categoryName });
        await newCategory.save();
        return {
            msg: "Adding New Category Process Has Been Successfuly ...",
            error: false,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

async function getAllCategories() {
    try {
        return {
            msg: "Get All Categories Process Has Been Successfully !!",
            error: false,
            data: await categoryModel.find({}),
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

async function getAllCategoriesInsideThePage(pageNumber, pageSize) {
    try {
        return {
            msg: `Get All Categories Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await categoryModel.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteCategory(categoryId) {
    try {
        const deletingDetails = await categoryModel.deleteOne({
            _id: categoryId,
        });
        if (deletingDetails.deletedCount > 0) {
            return {
                msg: "Deleting Category Process Has Been Successfuly ...",
                error: false,
                data: await categoryModel.find({}),
            };
        }
        return {
            msg: "Sorry, This Category Is Not Exist !!",
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateCategory(categoryId, newCategoryName) {
    try {
        const updatingDetails = await categoryModel.updateOne( { _id: categoryId } , { name: newCategoryName })
        if (updatingDetails.updatedCount > 0) {
            return {
                msg: "Updating Category Process Has Been Successfuly !!",
                error: false,
                data: await categoryModel.find({}),
            };
        }
        return {
            msg: "Sorry, This Category Is Not Exist !!",
            error: true,
            data: {},
        };
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