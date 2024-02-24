const globalPasswordRouter = require("express").Router();

const globalPasswordController = require("../controllers/global_password.controller");

globalPasswordRouter.put("/change-bussiness-email-password", globalPasswordController.putChangeBussinessEmailPassword);

module.exports = globalPasswordRouter;