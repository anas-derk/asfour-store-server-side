const adminsRouter = require("express").Router();

const adminsController = require("../controllers/admins.controller");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const { validateJWT, validateEmail, validatePassword } = require("../middlewares/global.middlewares");

adminsRouter.get("/login",
    async (req, res, next) => {
        const emailAndPassword = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: emailAndPassword.email, dataType: "string", isRequiredValue: true },
            { fieldName: "Password", fieldValue: emailAndPassword.password, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.query.email, res, next),
    (req, res, next) => validatePassword(req.query.password, res, next),
    adminsController.getAdminLogin
);

adminsRouter.get("/user-info", validateJWT, adminsController.getAdminUserInfo);

adminsRouter.put("/change-admin-password",
    validateJWT,
    async (req, res, next) => {
        const data = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Website Owner Email", fieldValue: data.websiteOwnerEmail, dataType: "string", isRequiredValue: true },
            { fieldName: "Website Owner Password", fieldValue: data.websiteOwnerPassword, dataType: "string", isRequiredValue: true },
            { fieldName: "Admin Email", fieldValue: data.adminEmail, dataType: "string", isRequiredValue: true },
            { fieldName: "New Admin Password", fieldValue: data.newAdminPassword, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.query.adminEmail, res, next),
    (req, res, next) => validateEmail(req.query.websiteOwnerEmail, res, next),
    (req, res, next) => validatePassword(req.query.newAdminPassword, res, next),
    adminsController.putAdminPassword
);

module.exports = adminsRouter;