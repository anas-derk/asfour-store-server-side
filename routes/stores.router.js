const storesRouter = require("express").Router();

const storesController = require("../controllers/stores.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

storesRouter.get("/all-stores-inside-the-page", storesController.getAllStoresInsideThePage);

storesRouter.get("/stores-count", storesController.getStoresCount);

storesRouter.get("/store-details/:orderId", storesController.getStoreDetails);

storesRouter.post("/create-new-store", storesController.postNewStore);

storesRouter.post("/update-store/:orderId", validateJWT, storesController.putStoreInfo);

storesRouter.delete("/delete-store/:orderId", validateJWT, storesController.deleteStore);

module.exports = storesRouter;