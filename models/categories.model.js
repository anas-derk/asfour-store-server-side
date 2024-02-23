// Import Mongoose And Admin Model Object

const { mongoose, categoryModel } = require("../models/all.models");

async function addNewCategory(categoryName) {
    try{
        await mongoose.connect(process.env.DB_URL);
        const category = await categoryModel.findOne({ name: categoryName });
        if (category) return "Sorry, This Cateogry Is Already Exist !!";
        const newCategory = new categoryModel({ name: categoryName });
        await newCategory.save();
        await mongoose.disconnect();
        return "Adding New Category Process It Successfuly ...";
    }
    catch(err){
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllCategories() {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const allCategories = await categoryModel.find({});
        await mongoose.disconnect();
        return allCategories;
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getCategoriesCount(filters) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const categoriesCount = await categoryModel.countDocuments(filters);
        await mongoose.disconnect();
        return categoriesCount;
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllCategoriesInsideThePage(pageNumber, pageSize) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const categoriesListInsideThePage = await categoryModel.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize);
        await mongoose.disconnect();
        return categoriesListInsideThePage;
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function deleteCategory(categoryId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const deletingDetails = await categoryModel.deleteOne({
            _id: categoryId,
        });
        if (deletingDetails.deletedCount > 0) {
            const newCategoiesList = await categoryModel.find({});
            await mongoose.disconnect();
            return {
                msg: "Deleting Category Process Has Been Successfuly ...",
                isError: false,
                newCategoiesList,
            };
        }
        await mongoose.disconnect();
        return {
            isError: true,
            msg: "Sorry, This Category Id Is Not Exist !!",
        };
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function updateCategory(categoryId, newCategoryName) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        await categoryModel.updateOne( { _id: categoryId } , { name: newCategoryName });
        await mongoose.disconnect();
        return "Updating Category Process It Successfuly ...";
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
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