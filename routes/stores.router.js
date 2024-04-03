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

storesRouter.get("/all-stores-inside-the-page", storesController.getAllStoresInsideThePage);

storesRouter.get("/stores-count", storesController.getStoresCount);

storesRouter.get("/store-details/:orderId", storesController.getStoreDetails);

storesRouter.post("/create-new-store", multer({
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
}).single("storeImg") ,storesController.postNewStore);

storesRouter.post("/update-store/:orderId", validateJWT, storesController.putStoreInfo);

storesRouter.delete("/delete-store/:orderId", validateJWT, storesController.deleteStore);

module.exports = storesRouter;