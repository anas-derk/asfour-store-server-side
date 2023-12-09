const ordersRouter = require("express").Router();

const ordersController = require("../controllers/orders.controller");

ordersRouter.post("/create-new-order", ordersController.postNewOrder);

ordersRouter.post("/send-order-to-upayments", ordersController.postNewPayment);

ordersRouter.put("/update-order/:orderId", ordersController.putOrder);

module.exports = ordersRouter;