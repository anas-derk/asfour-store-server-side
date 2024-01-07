const brandsRouter = require("express").Router();

const brandsController = require("../controllers/brands.controller");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets/images/brands");
    },
    filename: (req, file, cb) => {
        cb(null, `${Math.random()}_${Date.now()}__${file.originalname.replaceAll(" ", "_")}`);
    },
});

brandsRouter.post("/add-new-brand", multer({ storage }).single("brandImg"), brandsController.postNewBrand);

module.exports = brandsRouter;