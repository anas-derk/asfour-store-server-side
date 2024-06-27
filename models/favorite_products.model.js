// Import Favorite Product Object

const { favoriteProductModel, productModel, userModel } = require("../models/all.models");

async function addNewFavoriteProduct(userId, productId) {
    try{
        const user = await userModel.findById(userId);
        if (user) {
            const product = await productModel.findById(productId);
            if (product) {
                const favoriteProduct = await favoriteProductModel.findOne({ userId, productId });
                if (!favoriteProduct) {
                    const newFavoriteProduct = new favoriteProductModel({
                        name: product.name,
                        price: product.price,
                        imagePath: product.imagePath,
                        productId,
                        userId
                    });
                    return {
                        msg: "Adding New Favorite Product Process Has Been Successfully !!",
                        error: false,
                        data: await newFavoriteProduct.save(),
                    }
                }
                return {
                    msg: "Sorry, This Favorite Product For This User Is Already Exist !!",
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
            msg: "Sorry, This User Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

async function getFavoriteProductsCount(filters) {
    try {
        return {
            msg: "Get All Favorite Products Count Process Has Been Successfully !!",
            error: false,
            data: await favoriteProductModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllFavoriteProductsInsideThePage(pageNumber, pageSize, filters) {
    try {
        return {
            msg: `Get All Favorite Products Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await favoriteProductModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getFavoriteProductsByProductsIdsAndUserId(userId, productsIds) {
    try{
        return {
            msg: "Get Favorite Products By Products Ids And User Id Process Has Been Successfully !!",
            error: false,
            data: await favoriteProductModel.find({ productId: { $in: productsIds }, userId }),
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function deleteFavoriteProduct(userId, productId) {
    try{
        const user = await userModel.findById(userId);
        if (user) {
            const favoriteProduct = await favoriteProductModel.findOneAndDelete({ productId, userId });
            if (favoriteProduct) {
                return {
                    msg: "Deleting Favorite Product Process Has Been Successfully !!",
                    error: false,
                    data: {},
                }
            }
            return {
                msg: "Sorry, This Favorite Product Is Not Exist !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This User Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

module.exports = {
    addNewFavoriteProduct,
    getFavoriteProductsCount,
    getAllFavoriteProductsInsideThePage,
    getFavoriteProductsByProductsIdsAndUserId,
    deleteFavoriteProduct
}