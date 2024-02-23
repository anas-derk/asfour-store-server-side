async function postNewCategory(req, res) {
    try{
        const categoryName = req.body.categoryName;
        if (!categoryName) await res.status(400).json("Please Send Category Name !!");
        else {
            const { addNewCategory } = require("../models/categories.model");
            const result = await addNewCategory(categoryName);
            await res.json(result);
        }
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function getCategoriesCount(req, res) {
    try {
        const filters = req.query;
        for (let objectKey in filters) {
            if (
                objectKey !== "pageNumber" &&
                objectKey !== "pageSize"
            ) { await res.status(400).json("Invalid Request, Please Send Valid Keys !!"); return; }
        }
        const { getCategoriesCount } = require("../models/categories.model");
        await res.json(await getCategoriesCount(filters));
    }
    catch (err) {
        await res.status(500).json(err);
    }
}

async function getAllCategoriesInsideThePage(req, res) {
    try {
        const filters = req.query;
        for (let objectKey in filters) {
            if (
                objectKey !== "pageNumber" &&
                objectKey !== "pageSize"
            ) { await res.status(400).json("Invalid Request, Please Send Valid Keys !!"); return; }
        }
        const { getAllCategoriesInsideThePage } = require("../models/categories.model");
        await res.json(await getAllCategoriesInsideThePage(filters.pageNumber, filters.pageSize));
    }
    catch (err) {
        await res.status(500).json(err);
    }
}

async function deleteCategory(req, res) {
    try{
        const categoryId = req.params.categoryId;
        if (!categoryId) await res.status(400).json("Sorry, Please Send Category Id !!");
        else {
            const { deleteCategory } = require("../models/categories.model");
            await res.json(await deleteCategory(categoryId));
        }
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function putCategory(req, res) {
    try{
        const categoryId = req.params.categoryId;
        const newCategoryName = req.body.newCategoryName;
        if (!categoryId || !newCategoryName) await res.status(400).json("Sorry, Please Send Category Id, New Catergory Name !!");
        else {
            const { updateCategory } = require("../models/categories.model");
            const result = await updateCategory(categoryId, newCategoryName);
            await res.json(result);
        }
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

module.exports = {
    postNewCategory,
    getCategoriesCount,
    getAllCategoriesInsideThePage,
    deleteCategory,
    putCategory,
}