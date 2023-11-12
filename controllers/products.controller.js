async function postNewProduct(req, res) {
    try {
        const productImages = Object.assign({}, req.files);
        const productInfo = {
            ...Object.assign({}, req.body),
            imagePath: productImages.productImage[0].path,
            galleryImagesPaths: productImages.galleryImages.map((galleryImage) => galleryImage.path),
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

async function getProductInfo(req, res) {
    try{
        const productId = req.params.productId;
        if (!productId) await res.status(400).json("Sorry, Please Send User Id !!");
        else {
            const { getProductInfo } = require("../models/products.model");
            const result = await getProductInfo(productId);
            await res.json(result);
        }
    }
    catch(err){
        await res.status(500).json(err);
    }
}

async function getAllProducts(req, res) {
    try{
        const { getAllProducts } = require("../models/products.model");
        const result = await getAllProducts();
        await res.json(result);
    }
    catch(err){
        await res.status(500).json(err);
    }
}

async function deleteProduct(req, res) {
    try{
        const productId = req.params.productId;
        if (!productId) await res.status(400).json("Sorry, Please Send User Id !!");
        else {
            const { deleteProduct } = require("../models/products.model");
            const productImagePaths = await deleteProduct(productId);
            const { unlinkSync } = require("fs");
            for(let productImagePath of productImagePaths) {
                unlinkSync(productImagePath);
            }
            await res.json("Deleting Product Process It Successfuly ...");
        }
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function deleteImageFromProductGallery(req, res) {
    try{
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
    catch(err) {
        console.log(err);
        await res.status(500).json(err);
    }
}

async function putProduct(req, res) {
    try{
        const productId = req.params.productId;
        const newProductData = req.body;
        if (!productId) await res.status(400).json("Sorry, Please Send User Id !!");
        else {
            const { updateProduct } = require("../models/products.model");
            const result = await updateProduct(productId, newProductData);
            await res.json(result);
        }
    }
    catch(err) {
        await res.status(500).json(err);
    }
}

async function putProductGalleryImage(req, res) {
    try{
        const productId = req.params.productId,
            oldGalleryImagePath = req.query.oldGalleryImagePath,
            newGalleryImagePath = req.file.path;
        if (!productId || !oldGalleryImagePath) await res.status(400).json("Sorry, Please Send Product Id And Gallery Image Path !!");
        else {
            const { updateProductGalleryImage } = require("../models/products.model");
            await updateProductGalleryImage(productId, oldGalleryImagePath, newGalleryImagePath);
            const { unlinkSync } = require("fs");
            unlinkSync(oldGalleryImagePath);
            await res.json("Updating Product Gallery Image Has Been Successfuly ...");
        }
    }
    catch(err){
        await res.status(500).json(err);
    }
}

module.exports = {
    postNewProduct,
    getProductInfo,
    deleteProduct,
    deleteImageFromProductGallery,
    getAllProducts,
    putProduct,
    putProductGalleryImage,
}