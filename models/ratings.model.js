// Import User, Product Model And Products Rating Model  Object

const { userModel, productModel, productsRatingModel } = require("../models/all.models");

async function addNewProductRating(userId, ratingInfo) {
    try{
        const user = await userModel.findById(userId);
        if (user) {
            const product = await productModel.findById(ratingInfo.productId);
            if (product) {
                const rating = await productsRatingModel.findOne({ userId, productId: ratingInfo.productId });
                if (rating) {
                    await productsRatingModel.updateOne({ userId, productId: ratingInfo.productId }, { rating: ratingInfo.rating });
                    return {
                        msg: "Updating Product Rating By This User Process Has Been Successfully !!",
                        error: false,
                        data: {},
                    }
                }
                const newRating = new productsRatingModel({
                    userId,
                    ratingInfo
                });
                await newRating.save();
                await productModel.updateOne({ _id: ratingInfo.productId });
                return {
                    msg: "Adding New Product Rating By This User Process Has Been Successfully !!",
                    error: false,
                    data: {},
                }
            }
            return {
                msg: "Sorry, This Product Is Not Found !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, The User Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

module.exports = {
    addNewProductRating
}