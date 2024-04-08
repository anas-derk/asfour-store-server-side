// Import Product Model Object

const { productModel, categoryModel, adminModel, mongoose } = require("../models/all.models");

async function addNewProduct(authorizationId, productInfo) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if ((new mongoose.Types.ObjectId(authorizationId)).equals(admin._id) && !admin.isBlocked) {
                const product = await productModel.findOne({ name: productInfo.name, category: productInfo.category });
                if (!product) {
                    const category = await categoryModel.findOne({ name: productInfo.category });
                    if (category) {
                        const newProductInfo = new productModel(productInfo);
                        await newProductInfo.save();
                        return {
                            msg: "Adding New Product Process Has Been Successfuly !!",
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: "Sorry, This Category Is Not Exist !!",
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: "Sorry, This Product Is Already Exist !!",
                    error: true,
                    data: {},
                }
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function addingNewImagesToProductGallery(authorizationId, productId, newGalleryImagePaths) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if ((new mongoose.Types.ObjectId(authorizationId)).equals(admin._id) && !admin.isBlocked) {
                const product = await productModel.findById(productId);
                if (product) {
                    await productModel.updateOne({ _id: productId },
                    {
                        galleryImagesPaths: product.galleryImagesPaths.concat(newGalleryImagePaths),
                    });
                    return {
                        msg: "Adding New Images To Product Gallery Process Has Been Successfuly !!",
                        error: false,
                        data: {
                            newGalleryImagePaths,
                        },
                    }
                }
                return {
                    msg: "Sorry, This Product Is Not Found !!",
                    error: false,
                    data: {},
                }
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
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

async function getAllProductsInsideThePage(pageNumber, pageSize, filters, sortDetailsObject) {
    try {
        return {
            msg: `Get Products Count Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await productModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort(sortDetailsObject),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getRelatedProductsInTheProduct(productId) {
    try {
        const productInfo = await productModel.findById(productId);
        if (productInfo) {
            return {
                msg: "Get Sample From Related Products In This Product Process Has Been Successfuly !!",
                error: false,
                data: await productModel.aggregate([
                    { $match: { category: productInfo.category, _id: { $ne: new mongoose.Types.ObjectId(productId) } } },
                    { $sample: { size: 10 } }
                ]),
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

async function deleteProduct(authorizationId, productId) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if ((new mongoose.Types.ObjectId(authorizationId)).equals(admin._id) && !admin.isBlocked) {
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
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
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
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if ((new mongoose.Types.ObjectId(authorizationId)).equals(admin._id) && !admin.isBlocked) {
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
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function updateProduct(authorizationId, productId, newData) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if ((new mongoose.Types.ObjectId(authorizationId)).equals(admin._id) && !admin.isBlocked) {
                const product = await productModel.findOneAndUpdate({ _id: productId }, { ...newData });
                if (product) {
                    return {
                        msg: "Updating Product Process Has Been Successfully !!",
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
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        console.log(err);
        throw Error(err);
    }
}

async function updateProductGalleryImage(authorizationId, productId, oldGalleryImagePath, newGalleryImagePath) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if ((new mongoose.Types.ObjectId(authorizationId)).equals(admin._id) && !admin.isBlocked) {
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
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function updateProductImage(authorizationId, productId, newProductImagePath) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if ((new mongoose.Types.ObjectId(authorizationId)).equals(admin._id) && !admin.isBlocked) {
                const product = await productModel.findById(productId);
                if (product) {
                    await productModel.updateOne({ _id: productId }, {
                        imagePath: newProductImagePath,
                    });
                    return {
                        msg: "Change Product Image Process Has Been Successfully !!",
                        error: false,
                        data: {
                            deletedProductImagePath: product.imagePath,
                        },
                    }
                }
                return {
                    msg: "Sorry, This Product Is Not Exist !!",
                    error: true,
                    data: product.imagePath,
                }
            }
            return {
                msg: "Sorry, Permission Denied !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This Admin Is Not Exist !!",
            error: true,
            data: {},
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
    getRelatedProductsInTheProduct,
    deleteProduct,
    deleteImageFromProductGallery,
    updateProduct,
    updateProductGalleryImage,
    updateProductImage,
}