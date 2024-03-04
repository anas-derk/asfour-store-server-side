async function postNewCategory(req, res) {
    try{
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json({
                msg: "Sorry, Please Send JWT For User !!",
                error: true,
                data: {},
            });
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const categoryName = req.body.categoryName;
        if (!categoryName) await res.status(400).json("Please Send Category Name !!");
        else {
            const { addNewCategory } = require("../models/categories.model");
            const result = await addNewCategory(categoryName);
            await res.json({
                msg: result,
                error: result === "Sorry, This Cateogry Is Already Exist !!",
                data: {},
            });
        }
    }
    catch(err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
    }
}

async function getAllCategories(req, res) {
    try {
        const { getAllCategories } = require("../models/categories.model");
        await res.json(await getAllCategories());
    }
    catch (err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
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
                await res.status(400).json({
                    msg: "Invalid Request, Please Send Valid Keys !!",
                    error: true,
                    data: {},
                });
                return;
            }
        }
        const { getCategoriesCount } = require("../models/categories.model");
        await res.json(await getCategoriesCount(filters));
    }
    catch (err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
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
                await res.status(400).json({
                    msg: "Invalid Request, Please Send Valid Keys !!",
                    error: true,
                    data: {},
                });
                return;
            }
        }
        const { getAllCategoriesInsideThePage } = require("../models/categories.model");
        await res.json(await getAllCategoriesInsideThePage(filters.pageNumber, filters.pageSize));
    }
    catch (err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
    }
}

async function deleteCategory(req, res) {
    try{
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json({
                msg: "Sorry, Please Send JWT For User !!",
                error: true,
                data: {},
            });
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const categoryId = req.params.categoryId;
        if (!categoryId) {
            await res.status(400).json({
                msg: "Sorry, Please Send Category Id !!",
                error: true,
                data: {},
            });
            return;
        }
        const { deleteCategory } = require("../models/categories.model");
        await res.json(await deleteCategory(categoryId));
    }
    catch(err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
    }
}

async function putCategory(req, res) {
    try{
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json({
                msg: "Sorry, Please Send JWT For User !!",
                error: true,
                data: {},
            });
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const categoryId = req.params.categoryId;
        const newCategoryName = req.body.newCategoryName;
        if (!categoryId || !newCategoryName) {
            await res.status(400).json({
                msg: "Sorry, Please Send Category Id, New Catergory Name !!",
                error: true,
                data: {},
            });
            return;
        }
        const { updateCategory } = require("../models/categories.model");
        await res.json(await updateCategory(categoryId, newCategoryName));
    }
    catch(err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
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