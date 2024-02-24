const globalPasswordRouter = require("express").Router();

const globalPasswordController = require("../controllers/global_passwords.controller");

globalPasswordRouter.put("/change-bussiness-email-password", globalPasswordController.putChangeBussinessEmailPassword);

module.exports = globalPasswordRouter;