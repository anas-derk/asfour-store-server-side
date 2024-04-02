const adminsRouter = require("express").Router();

const adminsController = require("../controllers/admins.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

adminsRouter.get("/login", adminsController.getAdminLogin);

adminsRouter.get("/user-info", validateJWT, adminsController.getAdminUserInfo);

module.exports = adminsRouter;