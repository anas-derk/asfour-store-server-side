const adminRouter = require("express").Router();

const adminController = require("../controllers/admin.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

adminRouter.get("/login", adminController.getAdminLogin);

adminRouter.get("/user-info", validateJWT, adminController.getAdminUserInfo);

module.exports = adminRouter;