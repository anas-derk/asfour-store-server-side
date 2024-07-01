const { getResponseObject } = require("../global/functions");

const ratingOPerationsManagmentFunctions = require("../models/ratings.model");


async function postAddNewProductRating(req, res){
    try{
        res.json(await ratingOPerationsManagmentFunctions.addNewProductRating(req.data._id, req.body));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

module.exports = {
    postAddNewProductRating,
}