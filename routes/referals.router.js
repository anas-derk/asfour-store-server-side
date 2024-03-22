const referalsRouter = require("express").Router();

const referalsController = require("../controllers/referal.controller");

referalsRouter.post("/add-new-referal", referalsController.postAddNewReferal);

module.exports = referalsRouter;