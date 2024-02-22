// Import Mongoose And Product Model Object

const { mongoose, productModel } = require("../models/all.models");

async function addNewProduct(productInfo) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const newProductInfo = new productModel(productInfo);
        await newProductInfo.save();
        await mongoose.disconnect();
        return "Adding New Product Process It Successfuly ...";
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
            return productInfo;
        }
        else {
            await mongoose.disconnect();
            return "Sorry, This Product It Not Exist !!!";
        }
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getProductsCount() {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const productsCount = await productModel.countDocuments({});
        await mongoose.disconnect();
        return productsCount;
    }
    catch (err) {
        // Disconnect To DB
        await mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllProductsInsideThePage(pageNumber, pageSize) {
    try {
        // Connect To DB
        await mongoose.connect(process.env.DB_URL);
        const productsCount = await productModel.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize);
        await mongoose.disconnect();
        return productsCount;
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
                deletedProductPath: productInfo.imagePath,
                galleryImagePathsForDeletedProduct: productInfo.galleryImagesPaths,
                isError: false,
                msg: "Deleting Product Process Has Been Successfuly ...",
            };
        }
        return {
            msg: "Sorry, This Product Id Is Not Exist !!",
            isError: true,
        };
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
        return "Updating Product Process Has Been Successfuly ...";
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
        return imagePath;
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