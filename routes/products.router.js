const productsRouter = require("express").Router();

const productsController = require("../controllers/products.controller");

const multer = require("multer");

const { validateJWT } = require("../middlewares/global.middlewares");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets/images/products");
    },
    filename: (req, file, cb) => {
        cb(null, `${Math.random()}_${Date.now()}__${file.originalname.replaceAll(" ", "_")}`);
    },
});

productsRouter.post("/add-new-product", validateJWT, multer({
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
productsController.postNewProduct);

productsRouter.post("/adding-new-images-to-product-gallery/:productId", validateJWT, multer({
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
}).array("productGalleryImage", 10), productsController.postNewImagesToProductGallery);

productsRouter.get("/product-info/:productId", productsController.getProductInfo);

productsRouter.get("/products-count", productsController.getProductsCount);

productsRouter.get("/all-products-inside-the-page", productsController.getAllProductsInsideThePage);

productsRouter.get("/sample-from-related-products-in-the-product/:productId", productsController.getRelatedProductsInTheProduct);

productsRouter.delete("/:productId", validateJWT, productsController.deleteProduct);

productsRouter.delete("/gallery-images/:productId", validateJWT, productsController.deleteImageFromProductGallery);

productsRouter.put("/:productId", validateJWT, productsController.putProduct);

productsRouter.put("/update-product-gallery-image/:productId", validateJWT, multer({
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
}).single("productGalleryImage") , productsController.putProductGalleryImage);

productsRouter.put("/update-product-image/:productId", validateJWT, multer({
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
}).single("productImage") , productsController.putProductImage);

module.exports = productsRouter;