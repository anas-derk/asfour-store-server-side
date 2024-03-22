const referalsRouter = require("express").Router();

const referalsController = require("../controllers/referals.controller");

referalsRouter.post("/add-new-referal", referalsController.postAddNewReferal);

module.exports = referalsRouter;