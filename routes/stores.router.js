const storesRouter = require("express").Router();

const storesController = require("../controllers/stores.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets/images/stores");
    },
    filename: (req, file, cb) => {
        cb(null, `${Math.random()}_${Date.now()}__${file.originalname.replaceAll(" ", "_")}`);
    },
});

storesRouter.get("/all-stores-inside-the-page",
    async (req, res, next) => {
        const filters = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(filters.pageNumber), dataType: "string", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(filters.pageSize), dataType: "string", isRequiredValue: true },
            { fieldName: "Store Id", fieldValue: filters._id, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    storesController.getAllStoresInsideThePage
);

storesRouter.get("/stores-count",
    async (req, res, next) => {
        const filters = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(filters.pageNumber), dataType: "string", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(filters.pageSize), dataType: "string", isRequiredValue: true },
            { fieldName: "Store Id", fieldValue: filters._id, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    storesController.getStoresCount
);

storesRouter.get("/store-details/:storeId",
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    storesController.getStoreDetails
);

storesRouter.post("/create-new-store",
    multer({
        storage,
        fileFilter: (req, file, cb) => {
            if (!file) {
                req.uploadError = "Sorry, No File Uploaded, Please Upload The File";
                return cb(null, false);
            }
            if (
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/webp"
            ){
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG, PNG And Webp files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("storeImg"),
    storesController.postNewStore
);

storesRouter.post("/approve-store/:storeId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    storesController.postApproveStore
);

storesRouter.put("/update-store-info/:storeId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    storesController.putStoreInfo
);

storesRouter.delete("/delete-store/:storeId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    storesController.deleteStore
);

storesRouter.delete("/reject-store/:storeId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: false },
            { fieldName: "Reject Reason", fieldValue: req.query.rejectingReason, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    storesController.deleteRejectStore
);

module.exports = storesRouter;