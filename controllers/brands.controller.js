const { getResponseObject } = require("../global/functions");

const brandsManagmentFunctions = require("../models/brands.model");

const { unlinkSync } = require("fs");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "storeId") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function postNewBrand(req, res) {
    try{
        const uploadError = req.uploadError;
        if (uploadError) {
            res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        const brandInfo = {
            ...Object.assign({}, req.body),
            imagePath: req.file.path,
        };
        res.json(await brandsManagmentFunctions.addNewBrand(brandInfo));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllBrands(req, res) {
    try{
        res.json(await brandsManagmentFunctions.getAllBrands());
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getBrandsCount(req, res) {
    try {
        const filters = req.query;
        console.log(getFiltersObject(filters));
        res.json(await brandsManagmentFunctions.getBrandsCount(getFiltersObject(filters)));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllBrandsInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await brandsManagmentFunctions.getAllBrandsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteBrand(req, res) {
    try{
        const result = await brandsManagmentFunctions.deleteBrand(req.params.brandId);
        if (!result.error) {
            unlinkSync(result.data.deletedBrandPath);
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putBrandInfo(req, res) {
    try{
        res.json(await brandsManagmentFunctions.updateBrandInfo(req.params.brandId, req.body.newBrandTitle));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putBrandImage(req, res) {
    try {
        const uploadError = req.uploadError;
        if (uploadError) {
            res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        const result = await brandsManagmentFunctions.changeBrandImage(req.params.brandId, req.file.path.replace(/\\/g, '/'));
        if (!result.error) {
            unlinkSync(result.data.deletedBrandImagePath);
        }
        res.json(result);
}
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
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