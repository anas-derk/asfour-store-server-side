// Import Mongoose And Product Model Object

const { mongoose, productModel } = require("../models/all.models");

async function addNewProduct(productInfo) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const newProductInfo = new productModel(productInfo);
        await newProductInfo.save();
        await mongoose.disconnect();
        return {
            msg: "Adding New Product Process Has Been Successfuly !!",
            error: false,
            data: {},
        }
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function addingNewImagesToProductGallery(productId, newGalleryImagePaths) {
    try{
        await mongoose.connect(process.env.DB_URL);
        const productDetails = await productModel.findById(productId);
        await productModel.updateOne({ _id: productId },
        {
            galleryImagesPaths: productDetails.galleryImagesPaths.concat(newGalleryImagePaths),
        });
        await mongoose.disconnect();
        return {
            msg: "Adding New Images To Product Gallery Process Has Been Successfuly !!",
            error: false,
            data: {},
        }
    }
    catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getProductInfo(productId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const productInfo = await productModel.findById(productId);
        if (productInfo) {
            await mongoose.disconnect();
            return {
                msg: "Get Product Info Process Has Been Successfuly !!",
                error: false,
                data: productInfo,
            }
        }
        await mongoose.disconnect();
        return {
            msg: "Sorry, This Product It Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getProductsCount(filters) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const productsCount = await productModel.countDocuments(filters);
        await mongoose.disconnect();
        return {
            msg: "Get Products Count Process Has Been Successfully !!",
            error: false,
            data: productsCount,
        }
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllProductsInsideThePage(pageNumber, pageSize, filters) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const productsCount = await productModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize);
        await mongoose.disconnect();
        return {
            msg: `Get Products Count Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: productsCount,
        }
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function deleteProduct(productId) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const productInfo = await productModel.findOneAndDelete({
            _id: productId,
        });
        await mongoose.disconnect();
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
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function deleteImageFromProductGallery(productId, galleryImagePath) {
    try{
        await mongoose.connect(process.env.DB_URL);
        const productData = await productModel.findById(productId);
        await productModel.updateOne({ _id: productId }, {
            galleryImagesPaths: productData.galleryImagesPaths.filter((path) => galleryImagePath !== path)
        });
        await mongoose.disconnect();
        return {
            msg: "Deleting Image From Product Gallery Process Has Been Successfully !!",
            error: false,
            data: {},
        }
    }
    catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function updateProduct(productId, newData) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        await productModel.updateOne({ _id: productId }, { ...newData });
        await mongoose.disconnect();
        return {
            msg: "Updating Product Process Has Been Successful !!",
            error: false,
            data: {},
        }
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function updateProductGalleryImage(productId, oldGalleryImagePath, newGalleryImagePath) {
    try{
        await mongoose.connect(process.env.DB_URL);
        const productData = await productModel.findById(productId);
        const galleryImagePathIndex = productData.galleryImagesPaths.findIndex((galleryImagePath) => galleryImagePath === oldGalleryImagePath);
        productData.galleryImagesPaths[galleryImagePathIndex] = newGalleryImagePath;
        await productModel.updateOne({ _id: productId }, {
            galleryImagesPaths: productData.galleryImagesPaths
        });
        await mongoose.disconnect();
        return {
            msg: "Updating Product Galley Image Process Has Been Successfully !!",
            error: false,
            data: {},
        }
    }
    catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function updateProductImage(productId, newProductImagePath) {
    try{
        await mongoose.connect(process.env.DB_URL);
        const { imagePath } = await productModel.findById(productId);
        await productModel.updateOne({ _id: productId }, {
            imagePath: newProductImagePath,
        });
        await mongoose.disconnect();
        return {
            msg: "Change Product Image Process Has Been Successfully !!",
            error: false,
            data: imagePath,
        };
    }
    catch(err) {
        await mongoose.disconnect();
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