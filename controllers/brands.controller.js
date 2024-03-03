async function postNewBrand(req, res) {
    try{
        const newBrandImagePath = req.file.path;
        const newBrandTitle = req.body.title;
        const { addNewBrand } = require("../models/brands.model");
        await res.json({
            msg: await addNewBrand({ imagePath: newBrandImagePath, title: newBrandTitle }),
            error: false,
            data: {},
        });
    }
    catch(err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
    }
}

async function getAllBrands(req, res) {
    try{
        const { getAllBrands } = require("../models/brands.model");
        await res.json({
            msg: "Get All Brands Process Has Been Successfully !!",
            error: false,
            data: await getAllBrands(),
        });
    }
    catch(err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
    }
}

async function getBrandsCount(req, res) {
    try {
        const filters = req.query;
        for (let objectKey in filters) {
            if (
                objectKey !== "pageNumber" &&
                objectKey !== "pageSize"
            ) { await res.status(400).json("Invalid Request, Please Send Valid Keys !!"); return; }
        }
        const { getBrandsCount } = require("../models/brands.model");
        await res.json({
            msg: "Get Brands Count Process Has Been Successfully !!",
            error: false,
            data: await getBrandsCount(filters),
        });
    }
    catch (err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
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
                await res.status(400).json({
                    msg: "Invalid Request, Please Send Valid Keys !!",
                    error: true,
                    data: {},
                });
                return;
            }
        }
        const { getAllBrandsInsideThePage } = require("../models/brands.model");
        await res.json({
            msg: `Get All Brands Inside The Page: ${filters.pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await getAllBrandsInsideThePage(filters.pageNumber, filters.pageSize),
        });
    }
    catch (err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
    }
}

async function deleteBrand(req, res) {
    try{
        const brandId = req.params.brandId;
        if (!brandId) await res.status(400).json("Sorry, Please Send Brand Id !!");
        else {
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
    }
    catch(err) {
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
    }
}

async function putBrandInfo(req, res) {
    try{
        const brandId = req.params.brandId;
        const newBrandTitle = req.body.newBrandTitle;
        if (!brandId || !newBrandTitle) await res.status(400).json("Sorry, Please Send Brand Id, New Brand Name !!");
        else {
            const { updateBrandInfo } = require("../models/brands.model");
            const result = await updateBrandInfo(brandId, newBrandTitle);
            await res.json({
                msg: result,
                error: false,
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

async function putBrandImage(req, res) {
    try {
        const brandId = req.params.brandId,
            newBrandImagePath = req.file.path;
        if (!brandId || !newBrandImagePath) await res.status(400).json("Sorry, Please Send Brand Id And New Image !!");
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
        await res.status(500).json({
            msg: err.message,
            error: true,
            data: {},
        });
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