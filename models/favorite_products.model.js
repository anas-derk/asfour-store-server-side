// Import Favorite Product Object

const { favoriteProductModel, productModel } = require("../models/all.models");

async function addNewFavoriteProduct(userId, productId) {
    try{
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
                await newFavoriteProduct.save();
                return {
                    msg: "Adding New Favorite Product Process Has Been Successfully !!",
                    error: false,
                    data: {},
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
    catch(err){
        throw Error(err);
    }
}

module.exports = {
    addNewFavoriteProduct
}