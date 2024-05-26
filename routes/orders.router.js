const ordersRouter = require("express").Router();

const ordersController = require("../controllers/orders.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

ordersRouter.get("/orders-count",
    async (req, res, next) => {
        const filters = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(filters.pageNumber), dataType: "number", isRequiredValue: false },
            { fieldName: "page Size", fieldValue: Number(filters.pageSize), dataType: "number", isRequiredValue: false },
        ], res, next);
    },
    ordersController.getOrdersCount
);

ordersRouter.get("/all-orders-inside-the-page",
    async (req, res, next) => {
        const filters = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(filters.pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(filters.pageSize), dataType: "number", isRequiredValue: true },
        ], res, next);
    },
    ordersController.getAllOrdersInsideThePage
);

ordersRouter.get("/order-details/:orderId",
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    ordersController.getOrderDetails
);

ordersRouter.post("/create-new-order", ordersController.postNewOrder);

ordersRouter.post("/create-payment-order-by-tap", ordersController.postNewPaymentOrderByTap);

ordersRouter.post("/create-payment-order-by-pilisio", ordersController.postNewPaymentOrderByPilisio);

ordersRouter.post("/update-order/:orderId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    ordersController.putOrder
);

ordersRouter.put("/products/update-product/:orderId/:productId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "Product Id", fieldValue: req.params.productId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    ordersController.putOrderProduct
);

ordersRouter.delete("/delete-order/:orderId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    ordersController.deleteOrder
);

ordersRouter.delete("/products/delete-product/:orderId/:productId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "Product Id", fieldValue: req.params.productId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    ordersController.deleteProductFromOrder
);

module.exports = ordersRouter;