const adminsRouter = require("express").Router();

const adminsController = require("../controllers/admins.controller");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const { validateJWT, validateEmail } = require("../middlewares/global.middlewares");

adminsRouter.get("/login",
    async (req, res, next) => {
        const emailAndPassword = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: emailAndPassword.email, dataType: "string", isRequiredValue: true },
            { fieldName: "Password", fieldValue: emailAndPassword.password, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.query.email, res, next),
    adminsController.getAdminLogin
);

adminsRouter.get("/user-info", validateJWT, adminsController.getAdminUserInfo);

module.exports = adminsRouter;