const { getResponseObject } = require("../global/functions");

async function postNewCategory(req, res) {
    try{
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json(getResponseObject("Sorry, Please Send JWT For User !!", true, {}));
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const categoryName = req.body.categoryName;
        if (!categoryName) {
            await res.status(400).json(getResponseObject("Please Send Category Name !!", true, {}));
            return;
        }
        const { addNewCategory } = require("../models/categories.model");
        await res.json(await addNewCategory(categoryName));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getAllCategories(req, res) {
    try {
        const { getAllCategories } = require("../models/categories.model");
        await res.json(await getAllCategories());
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getCategoriesCount(req, res) {
    try {
        const filters = req.query;
        for (let objectKey in filters) {
            if (
                objectKey !== "pageNumber" &&
                objectKey !== "pageSize"
            ) {
                await res.status(400).json(getResponseObject("Invalid Request, Please Send Valid Keys !!", true, {}));
                return;
            }
        }
        const { getCategoriesCount } = require("../models/categories.model");
        await res.json(await getCategoriesCount(filters));
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getAllCategoriesInsideThePage(req, res) {
    try {
        const filters = req.query;
        for (let objectKey in filters) {
            if (
                objectKey !== "pageNumber" &&
                objectKey !== "pageSize"
            ) {
                await res.status(400).json(getResponseObject("Invalid Request, Please Send Valid Keys !!", true, {}));
                return;
            }
        }
        const { getAllCategoriesInsideThePage } = require("../models/categories.model");
        await res.json(await getAllCategoriesInsideThePage(filters.pageNumber, filters.pageSize));
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function deleteCategory(req, res) {
    try{
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json(getResponseObject("Sorry, Please Send JWT For User !!", true, {}));
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const categoryId = req.params.categoryId;
        if (!categoryId) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Category Id !!", true, {}));
            return;
        }
        const { deleteCategory } = require("../models/categories.model");
        await res.json(await deleteCategory(categoryId));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putCategory(req, res) {
    try{
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json(getResponseObject("Sorry, Please Send JWT For User !!", true, {}));
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const categoryId = req.params.categoryId;
        const newCategoryName = req.body.newCategoryName;
        if (!categoryId || !newCategoryName) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Category Id, New Catergory Name !!", true, {}));
            return;
        }
        const { updateCategory } = require("../models/categories.model");
        await res.json(await updateCategory(categoryId, newCategoryName));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
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