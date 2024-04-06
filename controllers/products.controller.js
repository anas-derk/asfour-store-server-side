const { getResponseObject, checkIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const productsManagmentFunctions = require("../models/products.model");

const { unlinkSync } = require("fs");

async function postNewProduct(req, res) {
    try {
        const uploadError = req.uploadError;
        if (uploadError) {
            res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        const productImages = Object.assign({}, req.files);
        const productInfo = {
            ...Object.assign({}, req.body),
            imagePath: productImages.productImage[0].path.replace(/\\/g, '/'),
            galleryImagesPaths: productImages.galleryImages.map((galleryImage) => galleryImage.path.replace(/\\/g, '/')),
        };
        if(Number(productInfo.discount) < 0 || Number(productInfo.discount) > Number(productInfo.price)) {
            res.status(400).json(getResponseObject("Sorry, Please Send Valid Discount Value !!", true, {}));
            return;
        }
        res.json(await productsManagmentFunctions.addNewProduct(productInfo));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function postNewImagesToProductGallery(req, res) {
    try {
        const uploadError = req.uploadError;
        if (uploadError) {
            res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        res.json(await productsManagmentFunctions.addingNewImagesToProductGallery(req.params.productId, req.files.map(file => file.path)));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

function getFiltersAndSortDetailsObject(queryObject) {
    let filtersObject = {}, sortDetailsObject = {};
    for (let objectKey in queryObject) {
        if (objectKey === "category") filtersObject[objectKey] = queryObject[objectKey];
        if (objectKey === "name") filtersObject[objectKey] = { $regex: new RegExp(queryObject[objectKey], 'i') }
        if (objectKey === "sortBy") sortDetailsObject[objectKey] = queryObject[objectKey];
        if (objectKey === "sortType") sortDetailsObject[objectKey] = queryObject[objectKey];
    }
    return {filtersObject, sortDetailsObject};
}

async function getProductInfo(req, res) {
    try {
        const productId = req.params.productId;
        const checkResult = checkIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: true },
        ]);
        if (checkResult.error) {
            res.status(400).json(checkResult);
            return;
        }
        const { getProductInfo } = require("../models/products.model");
        res.json(await getProductInfo(productId));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getProductsCount(req, res) {
    try {
        res.json(await productsManagmentFunctions.getProductsCount(getFiltersAndSortDetailsObject(req.query).filtersObject));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllProductsInsideThePage(req, res) {
    try {
        const queryObject = req.query;
        const filtersAndSortDetailsObject = getFiltersAndSortDetailsObject(queryObject);
        let sortDetailsObject = {};
        if (filtersAndSortDetailsObject.sortDetailsObject) {
            sortDetailsObject[filtersAndSortDetailsObject.sortDetailsObject.sortBy] = Number(filtersAndSortDetailsObject.sortDetailsObject.sortType);
        }
        res.json(await productsManagmentFunctions.getAllProductsInsideThePage(queryObject.pageNumber, queryObject.pageSize, filtersAndSortDetailsObject.filtersObject, sortDetailsObject));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getRelatedProductsInTheProduct(req, res) {
    try{
        res.json(await productsManagmentFunctions.getRelatedProductsInTheProduct(req.params.productId));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteProduct(req, res) {
    try {
        const result = await productsManagmentFunctions.deleteProduct(req.params.productId);
        if(!result.error) {
            unlinkSync(result.data.deletedProductPath);
            for (let productImagePath of result.data.galleryImagePathsForDeletedProduct) {
                unlinkSync(productImagePath);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function deleteImageFromProductGallery(req, res) {
    try {
        const galleryImagePath = req.query.galleryImagePath;
        res.json(await productsManagmentFunctions.deleteImageFromProductGallery(req.params.productId, req.query.galleryImagePath));
        unlinkSync(galleryImagePath);
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putProduct(req, res) {
    try {
        res.json(await productsManagmentFunctions.updateProduct(req.params.productId, req.body));
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putProductGalleryImage(req, res) {
    try {
        const uploadError = req.uploadError;
        if (uploadError) {
            res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        const oldGalleryImagePath = req.query.oldGalleryImagePath;
        const result = await productsManagmentFunctions.updateProductGalleryImage(req.params.productId, oldGalleryImagePath, req.file.path);
        if (!result.error) {
            unlinkSync(oldGalleryImagePath);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putProductImage(req, res) {
    try {
        const uploadError = req.uploadError;
        if (uploadError) {
            res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        const result = await productsManagmentFunctions.updateProductImage(req.params.productId, req.file.path.replace(/\\/g, '/'));
        if (!result.error) {
            unlinkSync(result.data.deletedProductImagePath);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postNewProduct,
    postNewImagesToProductGallery,
    getProductsCount,
    getAllProductsInsideThePage,
    getProductInfo,
    getRelatedProductsInTheProduct,
    deleteProduct,
    deleteImageFromProductGallery,
    putProduct,
    putProductGalleryImage,
    putProductImage,
}