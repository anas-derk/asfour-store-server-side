const subscriptionsRouter = require("express").Router();

const subscriptionsController = require("../controllers/subscriptions.controller");

subscriptionsRouter.post("/add-new-subscription", subscriptionsController.postAddNewSubscription);

module.exports = subscriptionsRouter;