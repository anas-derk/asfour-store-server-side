const { getResponseObject, checkIsExistValueForFieldsAndDataTypes } = require("../global/functions");

async function postNewCategory(req, res) {
    try{
        const categoryName = req.body.categoryName;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Category Name", fieldValue: categoryName, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { addNewCategory } = require("../models/categories.model");
        res.json(await addNewCategory(categoryName));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllCategories(req, res) {
    try {
        const { getAllCategories } = require("../models/categories.model");
        res.json(await getAllCategories());
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getCategoriesCount(req, res) {
    try {
        const filters = req.query;
        const { getCategoriesCount } = require("../models/categories.model");
        res.json(await getCategoriesCount(filters));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllCategoriesInsideThePage(req, res) {
    try {
        const filters = req.query;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: filters.pageNumber, dataType: "string", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: filters.pageSize, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { getAllCategoriesInsideThePage } = require("../models/categories.model");
        res.json(await getAllCategoriesInsideThePage(filters.pageNumber, filters.pageSize));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteCategory(req, res) {
    try{
        const categoryId = req.params.categoryId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "category Id", fieldValue: categoryId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { deleteCategory } = require("../models/categories.model");
        res.json(await deleteCategory(categoryId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putCategory(req, res) {
    try{
        const categoryId = req.params.categoryId;
        const newCategoryName = req.body.newCategoryName;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "category Id", fieldValue: newCategoryName, dataType: "string", isRequiredValue: true },
            { fieldName: "new Category Name", fieldValue: newCategoryName, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { updateCategory } = require("../models/categories.model");
        res.json(await updateCategory(categoryId, newCategoryName));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postNewCategory,
    getAllCategories,
    getCategoriesCount,
    getAllCategoriesInsideThePage,
    deleteCategory,
    putCategory,
}