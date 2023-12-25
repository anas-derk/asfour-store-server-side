const ordersRouter = require("express").Router();

const ordersController = require("../controllers/orders.controller");

ordersRouter.get("/all-orders-inside-the-page", ordersController.getAllOrdersInsideThePage);

ordersRouter.get("/orders-count", ordersController.getOrdersCount);

ordersRouter.get("/order-details/:orderId", ordersController.getOrderDetails);

ordersRouter.post("/create-new-order", ordersController.postNewOrder);

ordersRouter.post("/send-order-to-upayments", ordersController.postNewPayment);

ordersRouter.post("/update-order/:orderId", ordersController.putOrder);

module.exports = ordersRouter;