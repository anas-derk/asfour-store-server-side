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

adminsRouter.get("/admins-count", validateJWT, adminsController.getAdminsCount);

adminsRouter.get("/all-admins-inside-the-page",
    validateJWT,
    async (req, res, next) => {
        const filters = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(filters.pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(filters.pageSize), dataType: "number", isRequiredValue: true },
        ], res, next);
    },
    adminsController.getAllAdminsInsideThePage
);

adminsRouter.post("/add-new-admin",
    validateJWT,
    async (req, res, next) => {
        const adminInfo = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "First Name", fieldValue: adminInfo.firstName, dataType: "string", isRequiredValue: true },
            { fieldName: "Last Name", fieldValue: adminInfo.lastName, dataType: "string", isRequiredValue: true },
            { fieldName: "Email", fieldValue: adminInfo.email, dataType: "string", isRequiredValue: true },
            { fieldName: "Password", fieldValue: adminInfo.password, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.body.email, res, next),
    (req, res, next) => validatePassword(req.body.password, res, next),
    adminsController.postAddNewAdmin
);

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