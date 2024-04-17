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
        const result = await brandsManagmentFunctions.addNewBrand(req.data._id, brandInfo);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllBrands(req, res) {
    try{
        res.json(await brandsManagmentFunctions.getAllBrands(getFiltersObject(req.query)));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getBrandsCount(req, res) {
    try {
        res.json(await brandsManagmentFunctions.getBrandsCount(getFiltersObject(req.query)));
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
        const result = await brandsManagmentFunctions.deleteBrand(req.data._id, req.params.brandId);
        if (!result.error) {
            unlinkSync(result.data.deletedBrandPath);
        }
        else {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putBrandInfo(req, res) {
    try{
        const result = await brandsManagmentFunctions.updateBrandInfo(req.data._id, req.params.brandId, req.body.newBrandTitle);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
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
        const result = await brandsManagmentFunctions.changeBrandImage(req.data._id, req.params.brandId, req.file.path.replace(/\\/g, '/'));
        if (!result.error) {
            unlinkSync(result.data.deletedBrandImagePath);
        }
        else {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
                return;
            }
        }
        res.json(result);
}
    catch (err) {
        console.log(err);
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