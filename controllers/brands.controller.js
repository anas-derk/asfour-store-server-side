const { getResponseObject, checkIsExistValueForFieldsAndDataTypes } = require("../global/functions");

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
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Brand Title", fieldValue: brandInfo.title, dataType: "string", isRequiredValue: true },
            { fieldName: "Store Id", fieldValue: brandInfo.storeId, dataType: "ObjectId", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { addNewBrand } = require("../models/brands.model");
        res.json(await addNewBrand(brandInfo));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllBrands(req, res) {
    try{
        const { getAllBrands } = require("../models/brands.model");
        res.json(await getAllBrands());
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getBrandsCount(req, res) {
    try {
        const filters = req.query;
        const { getBrandsCount } = require("../models/brands.model");
        res.json(await getBrandsCount(filters));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllBrandsInsideThePage(req, res) {
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
        const { getAllBrandsInsideThePage } = require("../models/brands.model");
        res.json(await getAllBrandsInsideThePage(filters.pageNumber, filters.pageSize));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteBrand(req, res) {
    try{
        const brandId = req.params.brandId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "brand Id", fieldValue: brandId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { deleteBrand } = require("../models/brands.model");
        const result = await deleteBrand(brandId);
        if (!result.error) {
            const { unlinkSync } = require("fs");
            unlinkSync(result.data.deletedBrandPath);
        }
        res.json(result);
    }
    catch(err) {
        console.log(err);
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putBrandInfo(req, res) {
    try{
        const   brandId = req.params.brandId,
                newBrandTitle = req.body.newBrandTitle;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Brand Id", fieldValue: brandId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "New Brand Title", fieldValue: newBrandTitle, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { updateBrandInfo } = require("../models/brands.model");
        res.json(await updateBrandInfo(brandId, newBrandTitle));
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
        const brandId = req.params.brandId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "brand Id", fieldValue: brandId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const newBrandImagePath = req.file.path.replace(/\\/g, '/');
        const { updateBrandImage } = require("../models/brands.model");
        const result = await updateBrandImage(brandId, newBrandImagePath);
        if (!result.error) {
            const { unlinkSync } = require("fs");
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