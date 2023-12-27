const ordersRouter = require("express").Router();

const ordersController = require("../controllers/orders.controller");

ordersRouter.get("/all-orders-inside-the-page", ordersController.getAllOrdersInsideThePage);

ordersRouter.get("/orders-count", ordersController.getOrdersCount);

ordersRouter.get("/order-details/:orderId", ordersController.getOrderDetails);

ordersRouter.post("/create-new-order", ordersController.postNewOrder);

ordersRouter.post("/send-order-to-upayments", ordersController.postNewUPaymentsPayment);

ordersRouter.post("/update-order/:orderId", ordersController.putOrder);

ordersRouter.post("/update-upayments-order/:orderId", ordersController.putUPaymentsOrder);

ordersRouter.put("/products/update-product/:orderId/:productId", ordersController.putOrderProduct);

ordersRouter.delete("/delete-order/:orderId", ordersController.deleteOrder);

ordersRouter.delete("/products/delete-product/:orderId/:productId", ordersController.deleteProductFromOrder);

module.exports = ordersRouter;