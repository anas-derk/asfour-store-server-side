const adminRouter = require("express").Router();

const adminController = require("../controllers/admin.controller");

adminRouter.get("/login", adminController.getAdminLogin);

adminRouter.get("/user-info", adminController.getAdminUserInfo);

module.exports = adminRouter;