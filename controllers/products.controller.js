async function postNewProduct(req, res) {
    try {
        const productImages = Object.assign({}, req.files);
        const productInfo = {
            ...Object.assign({}, req.body),
            imagePath: productImages.productImage[0].path.replace(/\\/g, '/'),
            galleryImagesPaths: productImages.galleryImages.map((galleryImage) => galleryImage.path.replace(/\\/g, '/')),
        };
        if (Object.keys(productInfo).length === 0) await res.status(400).json("Sorry, Please Send Product Info");
        else {
            const { addNewProduct } = require("../models/products.model");
            const result = await addNewProduct(productInfo);
            await res.json(result);
        }
    }
    catch (err) {
        const { unlinkSync } = require("fs");
        unlinkSync(productImagePath);
        await res.status(500).json(err);
    }
}

async function postNewImagesToProductGallery(req, res) {
    try {
        const productId = req.params.productId,
            newGalleryImagePaths = req.files.map(file => file.path);
        if (!productId || newGalleryImagePaths.length === 0) await res.json("Sorry, Please Send Product Id And New Images !!");
        else {
            const { addingNewImagesToProductGallery } = require("../models/products.model");
            await addingNewImagesToProductGallery(productId, newGalleryImagePaths);
            await res.json(newGalleryImagePaths);
        }
    }
    catch (err) {
        console.log(err);
        await res.status(500).json(err);
    }
}

async function getProductInfo(req, res) {
    try {
        const productId = req.params.productId;
        if (!productId) await res.status(400).json("Sorry, Please Send User Id !!");
        else {
            const { getProductInfo } = require("../models/products.model");
            const result = await getProductInfo(productId);
            await res.json(result);
        }
    }
    catch (err) {
        await res.status(500).json(err);
    }
}

async function getProductsCount(req, res) {
    try {
        const { getProductsCount } = require("../models/products.model");
        await res.json(await getProductsCount());
    }
    catch (err) {
        await res.status(500).json(err);
    }
}

async function getAllProductsInsideThePage(req, res) {
    try {
        const { getAllProductsInsideThePage } = require("../models/products.model");
        await res.json(await getAllProductsInsideThePage(req.query.pageNumber, req.query.pageSize));
    }
    catch (err) {
        await res.status(500).json(err);
    }
}

async function deleteProduct(req, res) {
    try {
        const productId = req.params.productId;
        if (!productId) await res.status(400).json("Sorry, Please Send User Id !!");
        else {
            const { deleteProduct } = require("../models/products.model");
            const result = await deleteProduct(productId);
            if(!result.isError) {
                const { unlinkSync } = require("fs");
                unlinkSync(result.deletedProductPath);
                for (let productImagePath of result.galleryImagePathsForDeletedProduct) {
                    unlinkSync(productImagePath);
                }
            }
            await res.json(result);
        }
    }
    catch (err) {
        console.log(err);
        await res.status(500).json(err);
    }
}

async function deleteImageFromProductGallery(req, res) {
    try {
        const productId = req.params.productId,
            galleryImagePath = req.query.galleryImagePath;
        if (!productId || !galleryImagePath) await res.status(400).json("Sorry, Please Send Product Id And Gallery Image Path !!");
        else {
            const { deleteImageFromProductGallery } = require("../models/products.model");
            await deleteImageFromProductGallery(productId, galleryImagePath);
            const { unlinkSync } = require("fs");
            unlinkSync(galleryImagePath);
            await res.json("Deleting Product Gallery Image Has Been Successfuly ...");
        }
    }
    catch (err) {
        console.log(err);
        await res.status(500).json(err);
    }
}

async function putProduct(req, res) {
    try {
        const productId = req.params.productId;
        const newProductData = req.body;
        if (!productId) await res.status(400).json("Sorry, Please Send User Id !!");
        else {
            const { updateProduct } = require("../models/products.model");
            const result = await updateProduct(productId, newProductData);
            await res.json(result);
        }
    }
    catch (err) {
        await res.status(500).json(err);
    }
}

async function putProductGalleryImage(req, res) {
    try {
        const productId = req.params.productId,
            oldGalleryImagePath = req.query.oldGalleryImagePath,
            newGalleryImagePath = req.file.path;
        if (!productId || !oldGalleryImagePath) await res.status(400).json("Sorry, Please Send Product Id And Gallery Image !!");
        else {
            const { updateProductGalleryImage } = require("../models/products.model");
            await updateProductGalleryImage(productId, oldGalleryImagePath, newGalleryImagePath);
            const { unlinkSync } = require("fs");
            unlinkSync(oldGalleryImagePath);
            await res.json(newGalleryImagePath);
        }
    }
    catch (err) {
        await res.status(500).json(err);
    }
}

async function putProductImage(req, res) {
    try {
        const productId = req.params.productId,
            newProductImagePath = req.file.path;
        if (!productId || !newProductImagePath) await res.status(400).json("Sorry, Please Send Product Id And New Image !!");
        else {
            const { updateProductImage } = require("../models/products.model");
            const oldImagePath = await updateProductImage(productId, newProductImagePath);
            const { unlinkSync } = require("fs");
            unlinkSync(oldImagePath);
            await res.json(newProductImagePath);
        }
    }
    catch (err) {
        await res.status(500).json(err);
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