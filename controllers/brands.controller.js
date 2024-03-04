const { getResponseObject } = require("../global/functions");

async function postNewBrand(req, res) {
    try{
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json(getResponseObject("Sorry, Please Send JWT For User !!", true, {}));
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const newBrandImagePath = req.file.path;
        const newBrandTitle = req.body.title;
        const { addNewBrand } = require("../models/brands.model");
        await res.json(await addNewBrand({ imagePath: newBrandImagePath, title: newBrandTitle }));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getAllBrands(req, res) {
    try{
        const { getAllBrands } = require("../models/brands.model");
        await res.json(await getAllBrands());
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getBrandsCount(req, res) {
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
        const { getBrandsCount } = require("../models/brands.model");
        await res.json(await getBrandsCount());
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getAllBrandsInsideThePage(req, res) {
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
        const { getAllBrandsInsideThePage } = require("../models/brands.model");
        await res.json(await getAllBrandsInsideThePage(filters.pageNumber, filters.pageSize));
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function deleteBrand(req, res) {
    try{
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json(getResponseObject("Sorry, Please Send JWT For User !!", true, {}));
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const brandId = req.params.brandId;
        if (!brandId) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Brand Id !!", true, {}));
            return;
        }
        const { deleteBrand } = require("../models/brands.model");
        const result = await deleteBrand(brandId);
        if (!result.isError) {
            const { unlinkSync } = require("fs");
            unlinkSync(result.deletedBrandPath);
        }
        await res.json({
            msg: result.msg,
            error: result.isError,
            data: !result.isError ? {
                deletedBrandPath: result.deletedBrandPath,
                newBrandsList: result.newBrandsList,
            } : {},
        });
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putBrandInfo(req, res) {
    try{
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json(getResponseObject("Sorry, Please Send JWT For User !!", true, {}));
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const brandId = req.params.brandId;
        const newBrandTitle = req.body.newBrandTitle;
        if (!brandId || !newBrandTitle) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Brand Id, New Brand Name !!", true, {}));
            return;
        }
        const { updateBrandInfo } = require("../models/brands.model");
        const result = await updateBrandInfo(brandId, newBrandTitle);
        await res.json({
            msg: result,
            error: false,
            data: {},
        });
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putBrandImage(req, res) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            await res.status(400).json(getResponseObject("Sorry, Please Send JWT For User !!", true, {}));
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const brandId = req.params.brandId,
            newBrandImagePath = req.file.path;
        if (!brandId || !newBrandImagePath) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Brand Id And New Image !!", true, {}));
        }
        else {
            const { updateBrandImage } = require("../models/brands.model");
            const oldImagePath = await updateBrandImage(brandId, newBrandImagePath);
            const { unlinkSync } = require("fs");
            unlinkSync(oldImagePath);
            await res.json({
                msg: "",
                error: false,
                data: {
                    newBrandImagePath,
                },
            });
        }
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

module.exports = {
    postNewBrand,
    getBrandsCount,
    getAllBrands,
    getAllBrandsInsideThePage,
    deleteBrand,
    putBrandInfo,
    putBrandImage,
}