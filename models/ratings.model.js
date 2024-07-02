// Import User, Product Model And Products Rating Model  Object

const { userModel, productModel, productsRatingModel } = require("../models/all.models");

async function selectProductRating(userId, ratingInfo) {
    try{
        const user = await userModel.findById(userId);
        if (user) {
            const product = await productModel.findById(ratingInfo.productId);
            if (product) {
                const ratingDetails = await productsRatingModel.findOne({ userId, productId: ratingInfo.productId });
                if (ratingDetails) {
                    await productsRatingModel.updateOne({ userId, productId: ratingInfo.productId }, { rating: ratingInfo.rating });
                    product.ratings[ratingDetails.rating] = product.ratings[ratingDetails.rating] - 1;
                    product.ratings[ratingInfo.rating] = product.ratings[ratingInfo.rating] + 1;
                    await productModel.updateOne({ _id: ratingInfo.productId }, { ratings: product.ratings });
                    return {
                        msg: "Updating Product Rating By This User Process Has Been Successfully !!",
                        error: false,
                        data: {},
                    }
                }
                const newRating = new productsRatingModel({
                    userId,
                    productId: ratingInfo.productId,
                    rating: ratingInfo.rating
                });
                await newRating.save();
                product.ratings[ratingInfo.rating] = product.ratings[ratingInfo.rating] + 1;
                await productModel.updateOne({ _id: ratingInfo.productId }, { ratings: product.ratings });
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

async function getProductRatingByUserId(userId, productId) {
    try{
        const user = await userModel.findById(userId);
        if (user) {
            const product = await productModel.findById(productId);
            if (product) {
                const ratingInfo = await productsRatingModel.findOne({ userId, productId });
                if (ratingInfo) {
                    return {
                        msg: "Get Product Rating By User Process Has Been Successfully !!",
                        error: false,
                        data: ratingInfo.rating,
                    }
                }
                return {
                    msg: "Sorry, This Product Can't Exist Any Rating By This User !!",
                    error: true,
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
    selectProductRating,
    getProductRatingByUserId
}