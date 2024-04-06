const productsRouter = require("express").Router();

const productsController = require("../controllers/products.controller");

const multer = require("multer");

const { validateJWT } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets/images/products");
    },
    filename: (req, file, cb) => {
        cb(null, `${Math.random()}_${Date.now()}__${file.originalname.replaceAll(" ", "_")}`);
    },
});

productsRouter.post("/add-new-product",
    validateJWT,
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
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG and PNG Or WEBP files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).fields([
        { name: "productImage", maxCount: 1 },
        { name: "galleryImages", maxCount: 10 },
    ]),
    async (req, res, next) => {
        const productImages = Object.assign({}, req.files);
        const productInfo = {
            ...Object.assign({}, req.body),
            imagePath: productImages.productImage[0].path.replace(/\\/g, '/'),
            galleryImagesPaths: productImages.galleryImages.map((galleryImage) => galleryImage.path.replace(/\\/g, '/')),
        };
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Name", fieldValue: productInfo.name, dataType: "string", isRequiredValue: true },
            { fieldName: "Price", fieldValue: Number(productInfo.price), dataType: "number", isRequiredValue: true },
            { fieldName: "Description", fieldValue: productInfo.description, dataType: "string", isRequiredValue: true },
            { fieldName: "Category", fieldValue: productInfo.category, dataType: "string", isRequiredValue: true },
            { fieldName: "discount", fieldValue: Number(productInfo.discount), dataType: "number", isRequiredValue: false },
            { fieldName: "Store Id", fieldValue: productInfo.storeId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
productsController.postNewProduct);

productsRouter.post("/adding-new-images-to-product-gallery/:productId",
    validateJWT,
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
            req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG and PNG Or WEBP files are allowed !!";
            return cb(null, false);
        }
        cb(null, true);
    }
    }).array("productGalleryImage", 10),
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    productsController.postNewImagesToProductGallery
);

productsRouter.get("/product-info/:productId",
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    productsController.getProductInfo
);

productsRouter.get("/products-count", productsController.getProductsCount);

productsRouter.get("/all-products-inside-the-page",
    async (req, res, next) => {
        const queryObject = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: queryObject.pageNumber, dataType: "string", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: queryObject.pageSize, dataType: "string", isRequiredValue: true },
            { fieldName: "Sort By", fieldValue: queryObject.sortBy, dataType: "string", isRequiredValue: false },
            { fieldName: "Sort Type", fieldValue: queryObject.sortType, dataType: "string", isRequiredValue: false },
        ], res, next);
    },
    productsController.getAllProductsInsideThePage
);

productsRouter.get("/related-products-in-the-product/:productId",
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    productsController.getRelatedProductsInTheProduct
);

productsRouter.delete("/:productId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    productsController.deleteProduct
);

productsRouter.delete("/gallery-images/:productId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataType: "string", isRequiredValue: true },
            { fieldName: "Gallery Image Path", fieldValue: req.query.galleryImagePath, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    productsController.deleteImageFromProductGallery
);

productsRouter.put("/:productId",
    validateJWT,
    async (req, res, next) => {
        const productId = req.params.productId;
        const newProductData = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "string", isRequiredValue: false },
            { fieldName: "Name", fieldValue: newProductData.name, dataType: "string", isRequiredValue: false },
            { fieldName: "Price", fieldValue: Number(newProductData.price), dataType: "number", isRequiredValue: false },
            { fieldName: "Description", fieldValue: newProductData.description, dataType: "string", isRequiredValue: false },
            { fieldName: "Category", fieldValue: newProductData.category, dataType: "string", isRequiredValue: false },
            { fieldName: "discount", fieldValue: Number(newProductData.discount), dataType: "number", isRequiredValue: false },
        ], res, next);
    },
    productsController.putProduct
);

productsRouter.put("/update-product-gallery-image/:productId",
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
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG and PNG Or WEBP files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("productGalleryImage"),
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataType: "string", isRequiredValue: true },
            { fieldName: "Old Gallery Image Path", fieldValue: req.query.oldGalleryImagePath, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    productsController.putProductGalleryImage
);

productsRouter.put("/update-product-image/:productId",
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
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG and PNG Or WEBP files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("productImage"),
    productsController.putProductImage
);

module.exports = productsRouter;