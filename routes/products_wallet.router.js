const walletRouter = require("express").Router();

const walletController = require("../controllers/products_wallet.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

walletRouter.get("/wallet-products-count", validateJWT, walletController.getWalletProductsCount);

walletRouter.get("/all-wallet-products-inside-the-page",
    validateJWT,
    async (req, res, next) => {
        const filters = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(filters.pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(filters.pageSize), dataType: "number", isRequiredValue: true },
        ], res, next);
    },
    walletController.getAllWalletProductsInsideThePage
);

walletRouter.delete("/:walletProductId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Wallet Product Id", fieldValue: req.params.walletProductId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    walletController.deleteWalletProduct
);

module.exports = walletRouter;