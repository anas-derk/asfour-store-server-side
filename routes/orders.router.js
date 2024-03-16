const ordersRouter = require("express").Router();

const ordersController = require("../controllers/orders.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

ordersRouter.get("/all-orders-inside-the-page", ordersController.getAllOrdersInsideThePage);

ordersRouter.get("/orders-count", ordersController.getOrdersCount);

ordersRouter.get("/order-details/:orderId", ordersController.getOrderDetails);

ordersRouter.post("/create-new-order", ordersController.postNewOrder);

ordersRouter.post("/update-order/:orderId", validateJWT, ordersController.putOrder);

ordersRouter.put("/products/update-product/:orderId/:productId", validateJWT, ordersController.putOrderProduct);

ordersRouter.delete("/delete-order/:orderId", validateJWT, ordersController.deleteOrder);

ordersRouter.delete("/products/delete-product/:orderId/:productId", validateJWT, ordersController.deleteProductFromOrder);

module.exports = ordersRouter;