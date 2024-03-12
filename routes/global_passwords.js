const globalPasswordRouter = require("express").Router();

const globalPasswordController = require("../controllers/global_passwords.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

globalPasswordRouter.put("/change-bussiness-email-password", validateJWT, globalPasswordController.putChangeBussinessEmailPassword);

module.exports = globalPasswordRouter;