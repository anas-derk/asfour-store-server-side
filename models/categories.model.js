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
        const allCategories = await categoryModel.find({});
        return {
            msg: "Get All Categories Process Has Been Successfully !!",
            error: false,
            data: allCategories,
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getCategoriesCount(filters) {
    try {
        const categoriesCount = await categoryModel.countDocuments(filters);
        return {
            msg: "Get All Categories Process Has Been Successfully !!",
            error: false,
            data: categoriesCount,
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllCategoriesInsideThePage(pageNumber, pageSize) {
    try {
        const categoriesListInsideThePage = await categoryModel.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize);
        return {
            msg: `Get All Categories Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: categoriesListInsideThePage,
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
            const newCategoiesList = await categoryModel.find({});
            return {
                msg: "Deleting Category Process Has Been Successfuly ...",
                error: false,
                data: newCategoiesList,
            };
        }
        return {
            msg: "Sorry, This Category Id Is Not Exist !!",
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
        await categoryModel.updateOne( { _id: categoryId } , { name: newCategoryName });
        return {
            msg: "Updating Category Process Has Been Successfuly !!",
            error: false,
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