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

brandsRouter.get("/all-brands", brandsController.getAllBrands);

brandsRouter.get("/brands-count", brandsController.getBrandsCount);

brandsRouter.get("/all-brands-inside-the-page", brandsController.getAllBrandsInsideThePage);

brandsRouter.delete("/:brandId", brandsController.deleteBrand);

brandsRouter.put("/:brandId", brandsController.putBrandInfo);

brandsRouter.put("/update-brand-image/:brandId", multer({ storage }).single("brandImage") , brandsController.putBrandImage);

module.exports = brandsRouter;