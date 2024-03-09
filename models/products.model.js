// Import Product Model Object

const { productModel } = require("../models/all.models");

async function addNewProduct(productInfo) {
    try {
        const newProductInfo = new productModel(productInfo);
        await newProductInfo.save();
        return {
            msg: "Adding New Product Process Has Been Successfuly !!",
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function addingNewImagesToProductGallery(productId, newGalleryImagePaths) {
    try{
        const product = await productModel.findById(productId);
        if (product) {
            await productModel.updateOne({ _id: productId },
            {
                galleryImagesPaths: product.galleryImagesPaths.concat(newGalleryImagePaths),
            });
            return {
                msg: "Adding New Images To Product Gallery Process Has Been Successfuly !!",
                error: false,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Product Is Not Found !!",
            error: false,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function getProductInfo(productId) {
    try {
        const productInfo = await productModel.findById(productId);
        if (productInfo) {
            return {
                msg: "Get Product Info Process Has Been Successfuly !!",
                error: false,
                data: productInfo,
            }
        }
        return {
            msg: "Sorry, This Product It Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getProductsCount(filters) {
    try {
        return {
            msg: "Get Products Count Process Has Been Successfully !!",
            error: false,
            data: await productModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllProductsInsideThePage(pageNumber, pageSize, filters) {
    try {
        return {
            msg: `Get Products Count Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await productModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteProduct(productId) {
    try {
        const productInfo = await productModel.findOneAndDelete({
            _id: productId,
        });
        if (productInfo) {
            return {
                msg: "Deleting Product Process Has Been Successfuly !!",
                error: false,
                data: {
                    deletedProductPath: productInfo.imagePath,
                    galleryImagePathsForDeletedProduct: productInfo.galleryImagesPaths,
                },
            }
        }
        return {
            msg: "Sorry, This Product Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteImageFromProductGallery(productId, galleryImagePath) {
    try{
        const product = await productModel.findById(productId);
        if (product) {
            await productModel.updateOne({ _id: productId }, {
                galleryImagesPaths: product.galleryImagesPaths.filter((path) => galleryImagePath !== path)
            });
            return {
                msg: "Deleting Image From Product Gallery Process Has Been Successfully !!",
                error: false,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Product Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function updateProduct(productId, newData) {
    try {
        const updatedDetails = await productModel.updateOne({ _id: productId }, { ...newData });
        if (updatedDetails.updatedCount > 0) {
            return {
                msg: "Updating Product Process Has Been Successful !!",
                error: false,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Product Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateProductGalleryImage(productId, oldGalleryImagePath, newGalleryImagePath) {
    try{
        const product = await productModel.findById(productId);
        if (product) {
            const galleryImagePathIndex = product.galleryImagesPaths.findIndex((galleryImagePath) => galleryImagePath === oldGalleryImagePath);
            if (galleryImagePathIndex >= 0) {
                product.galleryImagesPaths[galleryImagePathIndex] = newGalleryImagePath;
                await productModel.updateOne({ _id: productId }, {
                    galleryImagesPaths: product.galleryImagesPaths
                });
                return {
                    msg: "Updating Product Galley Image Process Has Been Successfully !!",
                    error: false,
                    data: {},
                }
            }
            return {
                msg: "Sorry, This Path Is Not Found !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Product Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function updateProductImage(productId, newProductImagePath) {
    try{
        const product = await productModel.findById(productId);
        if (product) {
            await productModel.updateOne({ _id: productId }, {
                imagePath: newProductImagePath,
            });
            return {
                msg: "Change Product Image Process Has Been Successfully !!",
                error: false,
                data: product.imagePath,
            }
        }
        return {
            msg: "Sorry, This Product Is Not Exist !!",
            error: true,
            data: product.imagePath,
        }
    }
    catch(err) {
        throw Error(err);
    }
}

module.exports = {
    addNewProduct,
    addingNewImagesToProductGallery,
    getProductInfo,
    getProductsCount,
    getAllProductsInsideThePage,
    deleteProduct,
    deleteImageFromProductGallery,
    updateProduct,
    updateProductGalleryImage,
    updateProductImage,
}