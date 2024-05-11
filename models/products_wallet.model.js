// Import Wallet Product Object

const { productsWalletModel, userModel } = require("./all.models");

async function getWalletProductsCount(filters) {
    try {
        return {
            msg: "Get All Products Count Inside The Wallet Process Has Been Successfully !!",
            error: false,
            data: await productsWalletModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllWalletProductsInsideThePage(pageNumber, pageSize, filters) {
    try {
        return {
            msg: `Get All Wallet Products Inside The Page: ${pageNumber} Process Has Been Successfully !!`,
            error: false,
            data: await productsWalletModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteWalletProduct(userId, productId) {
    try{
        const user = await userModel.findById(userId);
        if (user) {
            const walletProduct = await productsWalletModel.findOneAndDelete({ productId, userId });
            if (walletProduct) {
                return {
                    msg: "Deleting Product From Wallet Process Has Been Successfully !!",
                    error: false,
                    data: {},
                }
            }
            return {
                msg: "Sorry, This Product Inside The Wallet Is Not Exist !!",
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
    getWalletProductsCount,
    getAllWalletProductsInsideThePage,
    deleteWalletProduct
}