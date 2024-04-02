const storesRouter = require("express").Router();

const storesController = require("../controllers/stores.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

storesRouter.get("/all-stores-inside-the-page", storesController.getAllStoresInsideThePage);

storesRouter.get("/stores-count", storesController.getStoresCount);

// ordersRouter.get("/order-details/:orderId", ordersController.getOrderDetails);

// ordersRouter.post("/create-new-order", ordersController.postNewOrder);

// ordersRouter.post("/update-order/:orderId", validateJWT, ordersController.putOrder);

// ordersRouter.put("/products/update-product/:orderId/:productId", validateJWT, ordersController.putOrderProduct);

// ordersRouter.delete("/delete-order/:orderId", validateJWT, ordersController.deleteOrder);

// ordersRouter.delete("/products/delete-product/:orderId/:productId", validateJWT, ordersController.deleteProductFromOrder);

module.exports = storesRouter;