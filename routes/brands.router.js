const brandsRouter = require("express").Router();

const brandsController = require("../controllers/brands.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets/images/brands");
    },
    filename: (req, file, cb) => {
        cb(null, `${Math.random()}_${Date.now()}__${file.originalname.replaceAll(" ", "_")}`);
    },
});

brandsRouter.post("/add-new-brand",
    validateJWT,
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
    }).single("brandImg"),
    async (req, res, next) => {
        const brandInfo = {
            ...Object.assign({}, req.body),
            imagePath: req.file.path,
        };
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Brand Title", fieldValue: brandInfo.title, dataType: "string", isRequiredValue: true },
            { fieldName: "Store Id", fieldValue: brandInfo.storeId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    brandsController.postNewBrand
);

brandsRouter.get("/all-brands", brandsController.getAllBrands);

brandsRouter.get("/brands-count", brandsController.getBrandsCount);

brandsRouter.get("/all-brands-inside-the-page",
    async (req, res, next) => {
        const filters = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(filters.pageNumber), dataType: "string", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(filters.pageSize), dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    brandsController.getAllBrandsInsideThePage
);

brandsRouter.delete("/:brandId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "brand Id", fieldValue: req.params.brandId, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    brandsController.deleteBrand
);

brandsRouter.put("/:brandId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "brand Id", fieldValue: req.params.brandId, dataType: "string", isRequiredValue: true },
            { fieldName: "New Brand Title", fieldValue: req.body.newBrandTitle, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    brandsController.putBrandInfo
);

brandsRouter.put("/update-brand-image/:brandId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "brand Id", fieldValue: req.params.brandId, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    multer({
        storage,
        fileFilter: (req, file, cb) => {
            if (!file) {
                req.uploadError = "Sorry, No Files Uploaded, Please Upload The Files";
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
    }).single("brandImage") ,
    brandsController.putBrandImage
);

module.exports = brandsRouter;