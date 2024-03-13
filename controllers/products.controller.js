const { getResponseObject, checkIsExistValueForFieldsAndDataTypes } = require("../global/functions");

async function postNewProduct(req, res) {
    try {
        const uploadError = req.uploadError;
        if (uploadError) {
            await res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        const productImages = Object.assign({}, req.files);
        const productInfo = {
            ...Object.assign({}, req.body),
            imagePath: productImages.productImage[0].path.replace(/\\/g, '/'),
            galleryImagesPaths: productImages.galleryImages.map((galleryImage) => galleryImage.path.replace(/\\/g, '/')),
        };
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Name", fieldValue: productInfo.name, dataType: "string", isRequiredValue: true },
            { fieldName: "Price", fieldValue: Number(productInfo.price), dataType: "number", isRequiredValue: true },
            { fieldName: "Description", fieldValue: productInfo.description, dataType: "string", isRequiredValue: true },
            { fieldName: "Category", fieldValue: productInfo.category, dataType: "string", isRequiredValue: true },
            { fieldName: "discount", fieldValue: Number(productInfo.discount), dataType: "number", isRequiredValue: false },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        if(productInfo.discount < 0 || productInfo.discount > productInfo.price) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Valid Discount Value !!", true, {}));
            return;
        }
        const { addNewProduct } = require("../models/products.model");
        await res.json(await addNewProduct(productInfo));
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function postNewImagesToProductGallery(req, res) {
    try {
        const uploadError = req.uploadError;
        if (uploadError) {
            await res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        const productId = req.params.productId,
            newGalleryImagePaths = req.files.map(file => file.path);
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { addingNewImagesToProductGallery } = require("../models/products.model");
        await res.json(await addingNewImagesToProductGallery(productId, newGalleryImagePaths));
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "category") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function getProductInfo(req, res) {
    try {
        const productId = req.params.productId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { getProductInfo } = require("../models/products.model");
        await res.json(await getProductInfo(productId));
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getProductsCount(req, res) {
    try {
        const filters = req.query;
        const { getProductsCount } = require("../models/products.model");
        await res.json(await getProductsCount(getFiltersObject(filters)));
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function getAllProductsInsideThePage(req, res) {
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
        const { getAllProductsInsideThePage } = require("../models/products.model");
        await res.json(await getAllProductsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters)));
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function deleteProduct(req, res) {
    try {
        const productId = req.params.productId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { deleteProduct } = require("../models/products.model");
        const result = await deleteProduct(productId);
        if(!result.error) {
            const { unlinkSync } = require("fs");
            unlinkSync(result.data.deletedProductPath);
            for (let productImagePath of result.data.galleryImagePathsForDeletedProduct) {
                unlinkSync(productImagePath);
            }
        }
        await res.json(result);
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function deleteImageFromProductGallery(req, res) {
    try {
        const productId = req.params.productId,
            galleryImagePath = req.query.galleryImagePath;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
            { fieldName: "Gallery Image Path", fieldValue: galleryImagePath, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { deleteImageFromProductGallery } = require("../models/products.model");
        await res.json(await deleteImageFromProductGallery(productId, galleryImagePath));
        const { unlinkSync } = require("fs");
        unlinkSync(galleryImagePath);
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putProduct(req, res) {
    try {
        const productId = req.params.productId;
        const newProductData = req.body;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: false },
            { fieldName: "Name", fieldValue: newProductData.name, dataType: "string", isRequiredValue: false },
            { fieldName: "Price", fieldValue: Number(newProductData.price), dataType: "number", isRequiredValue: false },
            { fieldName: "Description", fieldValue: newProductData.description, dataType: "string", isRequiredValue: false },
            { fieldName: "Category", fieldValue: newProductData.category, dataType: "string", isRequiredValue: false },
            { fieldName: "discount", fieldValue: Number(newProductData.discount), dataType: "number", isRequiredValue: false },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { updateProduct } = require("../models/products.model");
        await res.json(await updateProduct(productId, newProductData));
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putProductGalleryImage(req, res) {
    try {
        const uploadError = req.uploadError;
        if (uploadError) {
            await res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        const productId = req.params.productId,
            oldGalleryImagePath = req.query.oldGalleryImagePath,
            newGalleryImagePath = req.file.path;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
            { fieldName: "Old Gallery Image Path", fieldValue: oldGalleryImagePath, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const { updateProductGalleryImage } = require("../models/products.model");
        const result = await updateProductGalleryImage(productId, oldGalleryImagePath, newGalleryImagePath);
        if (!result.error) {
            const { unlinkSync } = require("fs");
            unlinkSync(oldGalleryImagePath);
        }
        await res.json(result);
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putProductImage(req, res) {
    try {
        const uploadError = req.uploadError;
        if (uploadError) {
            await res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        const productId = req.params.productId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            await res.status(400).json(checkResult);
            return;
        }
        const newProductImagePath = req.file.path.replace(/\\/g, '/');
        const { updateProductImage } = require("../models/products.model");
        const result = await updateProductImage(productId, newProductImagePath);
        if (!result.error) {
            const { unlinkSync } = require("fs");
            unlinkSync(result.data.deletedProductImagePath);
        }
        await res.json(result);
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

module.exports = {
    postNewProduct,
    postNewImagesToProductGallery,
    getProductsCount,
    getAllProductsInsideThePage,
    getProductInfo,
    deleteProduct,
    deleteImageFromProductGallery,
    putProduct,
    putProductGalleryImage,
    putProductImage,
}