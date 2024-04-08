const { getResponseObject } = require("../global/functions");

const categoriesManagmentFunctions = require("../models/categories.model");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "storeId") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function postNewCategory(req, res) {
    try{
        res.json(await categoriesManagmentFunctions.addNewCategory(req.body.categoryName));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllCategories(req, res) {
    try {
        res.json(await categoriesManagmentFunctions.getAllCategories(getFiltersObject(req.query)));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getCategoriesCount(req, res) {
    try {
        const filters = req.query;
        res.json(await categoriesManagmentFunctions.getCategoriesCount(getFiltersObject(filters)));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllCategoriesInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await categoriesManagmentFunctions.getAllCategoriesInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteCategory(req, res) {
    try{
        res.json(await categoriesManagmentFunctions.deleteCategory(req.params.categoryId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putCategory(req, res) {
    try{
        res.json(await categoriesManagmentFunctions.updateCategory(req.params.categoryId, req.body.newCategoryName));
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