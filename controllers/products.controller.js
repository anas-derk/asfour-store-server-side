const { getResponseObject } = require("../global/functions");

async function postNewProduct(req, res) {
    try {
        const productImages = Object.assign({}, req.files);
        const productInfo = {
            ...Object.assign({}, req.body),
            imagePath: productImages.productImage[0].path.replace(/\\/g, '/'),
            galleryImagesPaths: productImages.galleryImages.map((galleryImage) => galleryImage.path.replace(/\\/g, '/')),
        };
        if (Object.keys(productInfo).length === 0) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Product Info", true, {}));
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
        const productId = req.params.productId,
            newGalleryImagePaths = req.files.map(file => file.path);
        if (!productId || newGalleryImagePaths.length === 0) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Product Id And New Images !!", true, {}));
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
        if (!productId) {
            await res.status(400).json(getResponseObject("Sorry, Please Send User Id !!", true, {}));
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
        for (let objectKey in filters) {
            if (
                objectKey !== "pageNumber" &&
                objectKey !== "pageSize" &&
                objectKey !== "category"
            ) {
                await res.status(400).json(getResponseObject("Invalid Request, Please Send Valid Keys !!", true, {}));
                return;
            }
        }
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
        if (
            objectKey !== "pageNumber" &&
            objectKey !== "pageSize" &&
            objectKey !== "category"
        ) {
            await res.status(400).json(getResponseObject("Invalid Request, Please Send Valid Keys !!", true, {}));
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
        if (!productId) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Product Id !!", true, {}));
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
        if (!productId || !galleryImagePath) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Product Id And Gallery Image Path !!", true, {}));
            return;
        }
        else {
            const { deleteImageFromProductGallery } = require("../models/products.model");
            await res.json(await deleteImageFromProductGallery(productId, galleryImagePath));
            const { unlinkSync } = require("fs");
            unlinkSync(galleryImagePath);
        }
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putProduct(req, res) {
    try {
        const productId = req.params.productId;
        const newProductData = req.body;
        if (!productId) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Product Id !!", true, {}));
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
        const productId = req.params.productId,
            oldGalleryImagePath = req.query.oldGalleryImagePath,
            newGalleryImagePath = req.file.path;
        if (!productId || !oldGalleryImagePath) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Product Id And Gallery Image !!", true, {}));
            return;
        }
        else {
            const { updateProductGalleryImage } = require("../models/products.model");
            await res.json(await updateProductGalleryImage(productId, oldGalleryImagePath, newGalleryImagePath));
            const { unlinkSync } = require("fs");
            unlinkSync(oldGalleryImagePath);
        }
    }
    catch (err) {
        await res.status(500).json(getResponseObject(err.message, true, {}));
    }
}

async function putProductImage(req, res) {
    try {
        const productId = req.params.productId,
            newProductImagePath = req.file.path;
        if (!productId || !newProductImagePath) {
            await res.status(400).json(getResponseObject("Sorry, Please Send Product Id And New Image !!", true, {}));
            return;
        }
        else {
            const { updateProductImage } = require("../models/products.model");
            const result = await updateProductImage(productId, newProductImagePath);
            const { unlinkSync } = require("fs");
            unlinkSync(result.data);
            await res.json(result);
        }
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