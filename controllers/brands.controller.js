const { getResponseObject, checkIsExistValueForFieldsAndDataTypes } = require("../global/functions");

async function postNewBrand(req, res) {
    try{
        const uploadError = req.uploadError;
        if (uploadError) {
            await res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        const newBrandTitle = req.body.title;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "new Brand Title", fieldValue: newBrandTitle, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const newBrandImagePath = req.file.path;
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
        const { getBrandsCount } = require("../models/brands.model");
        await res.json(await getBrandsCount(filters));
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
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
            await res.status(400).json(checkResult);
            return;
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
        const brandId = req.params.brandId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "brand Id", fieldValue: brandId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { deleteBrand } = require("../models/brands.model");
        const result = await deleteBrand(brandId);
        if (!result.error) {
            const { unlinkSync } = require("fs");
            unlinkSync(result.data.deletedBrandPath);
        }
        await res.json(result);
    }
    catch(err) {
        console.log(err);
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putBrandInfo(req, res) {
    try{
        const brandId = req.params.brandId;
        const newBrandTitle = req.body.newBrandTitle;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "brand Id", fieldValue: brandId, dataType: "string", isRequiredValue: true },
            { fieldName: "newBrandTitle", fieldValue: newBrandTitle, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { updateBrandInfo } = require("../models/brands.model");
        await res.json(await updateBrandInfo(brandId, newBrandTitle));
    }
    catch(err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putBrandImage(req, res) {
    try {
        const token = req.headers.authorization;
        const brandId = req.params.brandId;
        const newBrandImagePath = req.file.path;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "JWT", fieldValue: token, dataType: "string", isRequiredValue: true },
            { fieldName: "brand Id", fieldValue: brandId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { verify } = require("jsonwebtoken");
        verify(token, process.env.secretKey);
        const { updateBrandImage } = require("../models/brands.model");
        const result = await updateBrandImage(brandId, newBrandImagePath);
        if (!result.error) {
            const { unlinkSync } = require("fs");
            unlinkSync(oldImagePath);
        }
        await res.json(result);
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