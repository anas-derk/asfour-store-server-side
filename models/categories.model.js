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

async function deleteCategory(categoryId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        await categoryModel.deleteOne({
            _id: categoryId,
        });
        await mongoose.disconnect();
        return "Deleting Category Process It Successfuly ...";
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
    deleteCategory,
    updateCategory,
}