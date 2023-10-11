async function postNewProduct(req, res) {
    const bodyData = req.body;
    const productImagePath = req.file.path;
    const productInfo = {
        ...Object.assign({}, bodyData),
        imagePath: productImagePath,
    };
    if (Object.keys(productInfo).length === 0) res.json("Sorry, Please Send Product Info");
    else {
        try {
            const { addNewProduct } = require("../models/products.model");
            const result = await addNewProduct(productInfo);
            await res.json(result);
        }
        catch (err) {
            const { unlinkSync } = require("fs");
            unlinkSync(productImagePath);
            await res.status(500).json(err);
        }
    }
}

async function getProductInfo(req, res) {
    const productId = req.params.productId;
    if (!productId) res.json("Sorry, Please Send User Id !!");
    else {
        try{
            const { getProductInfo } = require("../models/products.model");
            const result = getProductInfo(productId);
            await res.json(result);
        }
        catch(err){
            await res.status(500).json(err);
        }
    }
}

async function getAllProducts(req, res) {
    const { getAllProducts } = require("../models/products.model");
    try{
        const result = await getAllProducts();
        await res.json(result);
    }
    catch(err){
        await res.status(500).json(err);
    }
}

async function deleteProduct(req, res) {
    const productId = req.params.productId;
    if (!productId) res.json("Sorry, Please Send User Id !!");
    else {
        const { deleteProduct } = require("../models/products.model");
        try{
            const imagePath = await deleteProduct(productId);
            const { unlinkSync } = require("fs");
            unlinkSync(imagePath);
            await res.json("Deleting Product Process It Successfuly ...");
        }
        catch(err){
            await res.status(500).json(err);
        }
    }
}

async function putProduct(req, res) {
    const productId = req.params.productId;
    const newProductData = req.body;
    if (!productId) res.json("Sorry, Please Send User Id !!");
    else {
        const { updateProduct } = require("../models/products.model");
        try{
            const result = await updateProduct(productId, newProductData);
            await res.json(result);
        }
        catch(err){
            await res.status(500).json(err);
        }
    }
}

module.exports = {
    postNewProduct,
    getProductInfo,
    deleteProduct,
    getAllProducts,
    putProduct,
}